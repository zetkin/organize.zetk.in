import * as types from '../actions';

import {
    getListItemById,
    updateOrAddListItem,
} from '../utils/store';


export default function peopleImport(state = null, action) {
    if (action.type == types.PARSE_IMPORT_FILE + '_FULFILLED') {
        return Object.assign({}, state, {
            tableSet: action.payload.tableSet,
        });
    }
    else if (action.type == types.USE_IMPORT_TABLE_FIRST_AS_HEADER) {
        let value = action.payload.useFirstAsHeader;
        let tableId = action.payload.tableId;
        let tableItem = getListItemById(state.tableSet.tableList, tableId);
        if (tableItem && tableItem.data.rows.length
            && tableItem.data.useFirstRowAsHeader !== value) {

            let table = Object.assign({}, tableItem.data, {
                useFirstRowAsHeader: value,
            });

            if (value) {
                table.rows = tableItem.data.rows.slice(1);
                table.columns = tableItem.data.columns.map((col, idx) => (
                    Object.assign({}, col, {
                        name: tableItem.data.rows[0].values[idx],
                    })
                ));
            }
            else {
                let firstRow = {
                    values: tableItem.data.columns.map(col => col.name)
                };

                table.rows = [ firstRow ].concat(tableItem.data.rows);
                table.columns = tableItem.data.columns.map(col =>
                    Object.assign({}, col, { name: undefined }));

            }

            console.log(table);
            return Object.assign({}, state, {
                tableSet: Object.assign({}, state.tableSet, {
                    tableList: updateOrAddListItem(state.tableSet.tableList,
                        tableId, table),
                    }),
            });
        }
        else {
            return state;
        }
    }
    else {
        return state || {
            tableSet: null,
        };
    }
}
