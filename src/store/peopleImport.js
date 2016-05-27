import * as types from '../actions';

import {
    createList,
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
                let oldTable = tableItem.data;
                table.rows = oldTable.rows.slice(1);
                table.columnList = createList(oldTable.columnList.items.map(
                    (colItem, idx) => Object.assign({}, colItem.data, {
                        name: tableItem.data.rows[0].values[idx],
                    })));
            }
            else {
                let firstRow = {
                    values: tableItem.data.columnList.items.map(colItem =>
                        colItem.data.name)
                };

                table.rows = [ firstRow ].concat(tableItem.data.rows);
                table.columnList = createList(
                    tableItem.data.columnList.items.map(colItem =>
                        Object.assign({}, colItem.data, { name: undefined })));
            }

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
    else if (action.type == types.UPDATE_IMPORT_COLUMN) {
        let tableId = action.payload.tableId;
        let tableItem = getListItemById(state.tableSet.tableList, tableId);

        let columnId = action.payload.columnId;
        let columnItem = getListItemById(tableItem.data.columnList, columnId);
        let column = Object.assign({}, columnItem.data, action.payload.props);

        let table = Object.assign({}, tableItem.data, {
            columnList: updateOrAddListItem(tableItem.data.columnList,
                column.id, column),
        });

        return Object.assign({}, state, {
            tableSet: Object.assign({}, state.tableSet, {
                tableList: updateOrAddListItem(state.tableSet.tableList,
                    table.id, table),
            }),
        });
    }
    else {
        return state || {
            tableSet: null,
        };
    }
}
