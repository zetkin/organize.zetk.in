import * as types from '../actions';

import makeRandomString from '../utils/makeRandomString';


export default function actionImport(state = null, action) {
    if (action.type == types.PARSE_ACTION_IMPORT_FILE + '_FULFILLED') {
        let tableSet = action.payload.tableSet;

        if (tableSet.tableList.items.length) {
            return Object.assign({}, state, {
                dataProcessed: false,
                dataRows: tableSet.tableList.items[0].data.rows.map(row => ({
                    id: '$' + makeRandomString(),
                    values: row.values,
                })),
            });
        }
        else {
            return state;
        }
    }
    else if (action.type == types.PROCESS_ACTION_IMPORT_DATA) {
        return Object.assign({}, state, {
            dataProcessed: true,
            dataRows: action.payload.dataRows,
        });
    }
    else if (action.type == types.SET_ACTION_IMPORT_MAPPING) {
        const { type, text, id } = action.payload;
        return Object.assign({}, state, {
            mappings: Object.assign({}, state.mappings, {
                [type]: Object.assign({}, state.mappings[type], {
                    [text]: id,
                }),
            }),
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
    else {
        return state || {
            mappings: {
                activity: {},
                location: {},
            },
            isPending: false,
            dataProcessed: false,
            dataRows: null,
        };
    }
}
