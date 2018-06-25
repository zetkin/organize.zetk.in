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

        // Actions are split into batches (ten at a time)
        dataRows
            .filter(row => row.selected)
            .filter(row => row.parsed.locationLink && row.parsed.activityLink)
            .forEach(row => {
                curBatch.push(row);
                if (curBatch.length == 10) {
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
                        location_id: row.parsed.locationLink.id || row.parsed.locationLink,
                        activity_id: row.parsed.activityLink.id || row.parsed.activityLink,
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

export function resetActionImport() {
    return {
        type: types.RESET_ACTION_IMPORT,
    };
}
