import * as types from '.';

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

export function processActionImportData() {
    return ({ dispatch, getState }) => {
        let dataRows = getState().actionImport.dataRows;

        const activityList = getState().activities.activityList;
        const locationList = getState().locations.locationList;

        if (dataRows && activityList && activityList.items && locationList && locationList.items) {
            dataRows = dataRows.map((row, index) => {
                const data = row.values;
                const base = Object.assign({}, row, {
                    error: null,
                    output: {
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
                const date = Date.create(data[0]);
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
                const locationString = data[3];
                if (locationString) {
                    let item = getItemByTitle(locationList, locationString);
                    locationLink = item? item.data.id : null;
                }
                else {
                    return Object.assign(base, {
                        error: { type: 'location', value: locationString },
                    });
                }

                // Resolve activity link if possible
                let activityLink = null;
                const activityString = data[4];
                if (activityString) {
                    let item = getItemByTitle(activityList, activityString);
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
                    output: { date, startTime, endTime,
                        locationLink, activityLink, participants, info },
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

function getItemByTitle(list, originalTitle) {
    let title = cleanTitle(originalTitle);
    return list.items.find(i => i.data.title.toLowerCase() == title);
}

function getSelectedFromMappings(mappings, originalTitle) {
    let title = originalTitle;
    return mappings[title] || null;
}
