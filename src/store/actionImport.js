import * as types from '../actions';

import makeRandomString from '../utils/makeRandomString';


export default function actionImport(state = null, action) {
    if (action.type == types.PARSE_ACTION_IMPORT_FILE + '_FULFILLED') {
        let tableSet = action.payload.tableSet.tableSet;
        let dataRows = tableSet.tableList.items[0].data.rows.map(row => ({
            id: '$' + makeRandomString(),
            selected: true,
            parsed: {},
            values: row.values,
        }));

        if (tableSet.tableList.items.length) {
            return Object.assign({}, state, {
                dataRows: processDataRows(dataRows, state.mappings),
            });
        }
        else {
            return state;
        }
    }
    else if (action.type == types.SET_ACTION_IMPORT_MAPPING) {
        const { type, text, id } = action.payload;
        const newMappings = Object.assign({}, state.mappings, {
            [type]: Object.assign({}, state.mappings[type], {
                [cleanTitle(text)]: id,
            }),
        });

        return Object.assign({}, state, {
            mappings: newMappings,
            dataRows: processDataRows(state.dataRows, newMappings),
        });
    }
    else if (action.type == types.TOGGLE_ACTION_IMPORT_ROW) {
        return Object.assign({}, state, {
            dataRows: state.dataRows.map(row => {
                if (row.id == action.payload.id) {
                    row = Object.assign({}, row, {
                        selected: action.payload.selected,
                    });
                }

                return row;
            }),
        });
    }
    else if (action.type == types.EXECUTE_ACTION_IMPORT + '_PENDING') {
        return Object.assign({}, state, {
            isPending: true,
            stats: {
                started: new Date(),
                completed: null,
                created: 0,
                errors: 0,
            },
            dataRows: state.dataRows.map(row => {
                if (row.selected && row.parsed.activityLink && row.parsed.locationLink) {
                    return Object.assign({}, row, {
                        output: {
                            isWaiting: true,
                            isPending: false,
                        }
                    });
                }
                else {
                    return Object.assign({}, row, { output: null });
                }
            }),
        });
    }
    else if (action.type == types.EXECUTE_ACTION_IMPORT + '_FULFILLED') {
        return Object.assign({}, state, {
            isPending: false,
            stats: Object.assign({}, state.stats, {
                completed: new Date(),
            }),
        });
    }
    else if (action.type == types.RESET_ACTION_IMPORT) {
        return Object.assign({}, state, {
            isPending: false,
            dataRows: null,
            stats: null,
        });
    }
    else if (action.type == types.CREATE_ACTION + '_PENDING' && action.meta.importRowId) {
        return Object.assign({}, state, {
            dataRows: state.dataRows.map(row => {
                if (row.id == action.meta.importRowId) {
                    return Object.assign({}, row, {
                        output: {
                            isWaiting: false,
                            isPending: true,
                        },
                    });
                }
                else {
                    return row;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_ACTION + '_REJECTED' && action.meta.importRowId) {
        return Object.assign({}, state, {
            stats: Object.assign({}, state.stats, {
                errors: state.stats.errors + 1,
            }),
            dataRows: state.dataRows.map(row => {
                if (row.id == action.meta.importRowId) {
                    return Object.assign({}, row, {
                        output: {
                            isWaiting: false,
                            isPending: false,
                            error: action.payload,
                        },
                    });
                }
                else {
                    return row;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_ACTION + '_FULFILLED' && action.meta.importRowId) {
        return Object.assign({}, state, {
            stats: Object.assign({}, state.stats, {
                created: state.stats.created + 1,
            }),
            dataRows: state.dataRows.map(row => {
                if (row.id == action.meta.importRowId) {
                    return Object.assign({}, row, {
                        output: {
                            isWaiting: false,
                            isPending: false,
                            actionId: action.payload.data.data.id,
                        },
                    });
                }
                else {
                    return row;
                }
            }),
        });
    }
    else if (action.type == types.RETRIEVE_LOCATIONS + '_FULFILLED') {
        const newMappings = Object.assign({}, state.mappings, {
            location: Object.assign({}, state.mappings.location),
        });

        action.payload.data.data.forEach(data =>
            newMappings.location[cleanTitle(data.title)] = data);

        return Object.assign({}, state, {
            mappings: newMappings,
            dataRows: processDataRows(state.dataRows, newMappings),
        });
    }
    else if (action.type == types.CREATE_LOCATION + '_FULFILLED'
        || action.type == types.RETRIEVE_LOCATION + '_FULFILLED') {
        const data = action.payload.data.data;
        const newMappings = Object.assign({}, state.mappings, {
            location: Object.assign({}, state.mappings.location, {
                [cleanTitle(data.title)]: data,
            })
        });

        return Object.assign({}, state, {
            mappings: newMappings,
            dataRows: processDataRows(state.dataRows, newMappings),
        });
    }
    else if (action.type == types.RETRIEVE_ACTIVITIES + '_FULFILLED') {
        const newMappings = Object.assign({}, state.mappings, {
            activity: Object.assign({}, state.mappings.activity),
        });

        action.payload.data.data.forEach(data =>
            newMappings.activity[cleanTitle(data.title)] = data);

        return Object.assign({}, state, {
            mappings: newMappings,
            dataRows: processDataRows(state.dataRows, newMappings),
        });
    }
    else if (action.type == types.CREATE_ACTIVITY + '_FULFILLED'
        || action.type == types.RETRIEVE_ACTIVITY + '_FULFILLED') {
        const data = action.payload.data.data;
        const newMappings = Object.assign({}, state.mappings, {
            activity: Object.assign({}, state.mappings.activity, {
                [cleanTitle(data.title)]: data,
            })
        });

        return Object.assign({}, state, {
            mappings: newMappings,
            dataRows: processDataRows(state.dataRows, newMappings),
        });
    }
    else {
        return state || {
            mappings: {
                activity: {},
                location: {},
            },
            isPending: false,
            dataRows: null,
        };
    }
}

function processDataRows(dataRows, mappings) {
    if (!dataRows) {
        return null;
    }

    return dataRows.map((row, index) => {
        let newParsed = null;
        const prevParsed = row.parsed;

        const data = row.values;

        // Parse date (only first time since it cannot change)
        if (!prevParsed.date) {
            const date = Date.create(data[0], { fromUTC: true });
            if (isNaN(date)) {
                return Object.assign({}, row, {
                    error: {
                        type: 'date', value: row.values[0],
                    }
                });
            }
            else if (prevParsed.date != date) {
                newParsed = Object.assign(newParsed || {}, { date });
            }
        }

        // Parse times (only first time since they cannot change)
        if (!prevParsed.startTime || !prevParsed.endTime) {
            const startTime = parseTime(data[1]);
            const endTime = parseTime(data[2]);
            if (startTime && endTime) {
                if (startTime != prevParsed.startTime || endTime != prevParsed.endTime) {
                    newParsed = Object.assign(newParsed || {}, { startTime, endTime });
                }
            }
            else {
                let badValue = startTime? data[2] : data[1];
                return Object.assign({}, row, {
                    error: { type: 'time', value: badValue, },
                });
            }
        }

        // Resolve location link if possible
        const locationString = data[3];
        if (locationString) {
            const locationLink = mappings.location[cleanTitle(locationString)];
            if (locationLink != prevParsed.locationLink) {
                newParsed = Object.assign(newParsed || {}, { locationLink });
            }
        }
        else {
            return Object.assign({}, row, {
                error: { type: 'location', value: locationString },
            });
        }

        // Resolve activity link if possible
        const activityString = data[4];
        if (activityString) {
            const activityLink = mappings.activity[cleanTitle(activityString)];
            if (activityLink != prevParsed.activityLink) {
                newParsed = Object.assign(newParsed || {}, { activityLink });
            }
        }
        else {
            return Object.assign(processed, {
                error: { type: 'activity', value: activityString },
            });
        }

        const participants = parseInt(data[5]) || 2;
        if (participants != prevParsed.participants) {
            newParsed = Object.assign(newParsed || {}, { participants });
        }

        const info = data[6] || '';
        if (info != prevParsed.info) {
            newParsed = Object.assign(newParsed || {}, { info });
        }

        if (!newParsed) {
            // Nothing changed, return original
            return row;
        }
        else {
            // Something changed, return non-mutated copy
            return Object.assign({}, row, {
                parsed: Object.assign({}, prevParsed, newParsed),
            });
        }
    });
}

function parseTime(str) {
    if (!str) {
        return null;
    }

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
