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
    else {
        return state || {
            mappings: {
                activity: {},
                location: {},
            },
            dataProcessed: false,
            dataRows: null,
        };
    }
}
