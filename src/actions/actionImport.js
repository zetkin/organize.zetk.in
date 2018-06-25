import * as types from '.';

import { getListItemById } from '../utils/store';
import { parseWorkbook } from '../utils/import';


export function parseActionImportFile(file) {
    let promise = new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = e => {
            // TODO: Check type and support CSV as well
            let tableSet = parseWorkbook(e.target.result);
            resolve({ tableSet });
        };

        reader.readAsBinaryString(file);
    });

    return {
        type: types.PARSE_ACTION_IMPORT_FILE,
        payload: { promise },
    };
}

export function toggleActionImportRow(id, selected) {
    return {
        type: types.TOGGLE_ACTION_IMPORT_ROW,
        payload: { id, selected },
    };
}

export function setActionImportMapping(type, text, id) {
    return ({ dispatch }) => {
        dispatch({
            type: types.SET_ACTION_IMPORT_MAPPING,
            payload: { type, text, id },
        });

        dispatch(processActionImportData());
    };
}

export function executeActionImport(campaignId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;
        const dataRows = getState().actionImport.dataRows;

        dispatch({
            type: types.EXECUTE_ACTION_IMPORT + '_PENDING',
            meta: { campaignId },
            payload: {},
        });

        let curBatch = [];
        const rowBatches = [];

        // Actions are split into batches (three at a time)
        dataRows
            .filter(row => row.selected)
            .filter(row => row.parsed.locationLink && row.parsed.activityLink)
            .forEach(row => {
                curBatch.push(row);
                if (curBatch.length == 3) {
                    rowBatches.push(curBatch);
                    curBatch = [];
                }
            });

        if (curBatch.length) {
            rowBatches.push(curBatch);
            curBatch = null;
        }

        // Batches are sequenced
        let bulkPromise = Promise.resolve();
        rowBatches.forEach(batchRows => {
            bulkPromise = bulkPromise.then(() => {
                let batchPromises = [];

                batchRows.forEach(row => {
                    const startDateTime = new Date(row.parsed.date)
                        .setUTC(true)
                        .addHours(row.parsed.startTime[0])
                        .addMinutes(row.parsed.startTime[1]);

                    const endDateTime = new Date(row.parsed.date)
                        .setUTC(true)
                        .addHours(row.parsed.endTime[0])
                        .addMinutes(row.parsed.endTime[1]);

                    const data = {
                        start_time: startDateTime.toISOString(),
                        end_time: endDateTime.toISOString(),
                        location_id: row.parsed.locationLink,
                        activity_id: row.parsed.activityLink,
                        num_participants_required: row.parsed.participants,
                        info_text: row.parsed.info,
                    };

                    const actionPromise = z.resource('orgs', orgId,
                        'campaigns', campaignId, 'actions').post(data)

                    batchPromises.push(actionPromise);

                    // Mimic createAction but include relevant meta
                    dispatch({
                        type: types.CREATE_ACTION,
                        meta: {
                            importRowId: row.id,
                        },
                        payload: {
                            promise: actionPromise,
                        }
                    });
                });

                return Promise.all(batchPromises);
            });
        });

        bulkPromise
            .then(() => {
                dispatch({
                    type: types.EXECUTE_ACTION_IMPORT + '_FULFILLED',
                    meta: { campaignId },
                    payload: {},
                });
            })
            .catch(err => {
                dispatch({
                    type: types.EXECUTE_ACTION_IMPORT + '_REJECTED',
                    meta: { campaignId },
                    payload: { error: err },
                });
            });
    };
}

export function processActionImportData() {
    return ({ dispatch, getState }) => {
        let dataRows = getState().actionImport.dataRows;

        const mappings = getState().actionImport.mappings;
        const activityList = getState().activities.activityList;
        const locationList = getState().locations.locationList;

        if (dataRows && activityList && activityList.items && locationList && locationList.items) {
            dataRows = dataRows.map((row, index) => {
                const data = row.values;
                const base = Object.assign({}, row, {
                    error: null,
                    selected: true,
                    parsed: {
                        date: null,
                        startTime: null,
                        endTime: null,
                        activityLink: null,
                        locationLink: null,
                        participants: 2,
                        info: '',
                    }
                });

                // Parse date
                const date = Date.create(data[0], { fromUTC: true });
                if (isNaN(date)) {
                    return Object.assign(base, {
                        error: {
                            type: 'date', value: row.values[0],
                        }
                    });
                }

                // Parse times
                const startTime = parseTime(data[1]);
                const endTime = parseTime(data[2]);
                if (!startTime || !endTime) {
                    let badValue = startTime? data[2] : data[1];
                    return Object.assign(base, {
                        error: { type: 'time', value: badValue, },
                    });
                }

                // Resolve location link if possible
                let locationLink = null;
                let locationMapped = false;
                const locationString = data[3];
                if (locationString) {
                    let id = mappings.location[locationString];
                    let item = id?
                        getListItemById(locationList, parseInt(id)) :
                        getListItemByTitle(locationList, locationString);

                    locationMapped = !!id;
                    locationLink = item? item.data.id : null;
                }
                else {
                    return Object.assign(base, {
                        error: { type: 'location', value: locationString },
                    });
                }

                // Resolve activity link if possible
                let activityLink = null;
                let activityMapped = false;
                const activityString = data[4];
                if (activityString) {
                    let id = mappings.activity[activityString];
                    let item = id?
                        getListItemById(activityList, parseInt(id)) :
                        getListItemByTitle(activityList, activityString);

                    activityMapped = !!id;
                    activityLink = item? item.data.id : null;
                }
                else {
                    return Object.assign(base, {
                        error: { type: 'activity', value: activityString },
                    });
                }

                const participants = parseInt(data[5]) || 2;
                const info = data[6] || '';

                return Object.assign(base, {
                    parsed: {
                        date, startTime, endTime,
                        locationLink, locationMapped,
                        activityLink, activityMapped,
                        participants, info,
                    },
                });
            });

            dispatch({
                type: types.PROCESS_ACTION_IMPORT_DATA,
                payload: { dataRows },
            });
        }
        else {
            // No-op
        }
    };
}

function parseTime(str) {
    const fields = str.split(/[\.:]+/);
    if (fields.length && fields.length <= 3) {
        let h = parseInt(fields[0])
        if (isNaN(h)) return null;

        let m = 0;
        if (fields.length > 1) {
            m = parseInt(fields[1]);
            if (isNaN(m)) {
                return null;
            }
        }

        if (m >= 0 && m < 60 && h >= 0 && h < 24) {
            return [h, m];
        }
        else {
            return null;
        }
    }
    else {
        const n = parseInt(str);
        if (!isNaN(n)) {
            return [n, 0];
        }
        else {
            return null;
        }
    }
}

function cleanTitle(originalTitle) {
   return originalTitle.trim().toLowerCase();
}

function getListItemByTitle(list, originalTitle) {
    let title = cleanTitle(originalTitle);
    return list.items.find(i => i.data.title.toLowerCase() == title);
}
