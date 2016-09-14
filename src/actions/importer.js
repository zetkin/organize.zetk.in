import * as types from '.';

import { parseWorkbook } from '../utils/import';
import { getListItemById } from '../utils/store';


export function parseImportFile(file) {
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
        type: types.PARSE_IMPORT_FILE,
        payload: { promise },
    };
}

export function useImportTableFirstRowAsHeader(tableId, useFirstAsHeader) {
    return {
        type: types.USE_IMPORT_TABLE_FIRST_AS_HEADER,
        payload: { tableId, useFirstAsHeader },
    };
}

export function updateImportColumn(tableId, columnId, props) {
    return ({ dispatch, getState }) => {
        let tableSet = getState().importer.tableSet;
        let tableItem = getListItemById(tableSet.tableList, tableId);
        let table = tableItem.data;

        let columnItem = getListItemById(table.columnList, columnId);

        if (props.type && props.type !== columnItem.data.type) {
            // Set default configuration for each type
            if (props.type == 'person_data') {
                props.config = {
                    field: 'id',
                };
            }
            else if (props.type == 'person_tag') {
                let colIndex = table.columnList.items.indexOf(columnItem);
                let tagList = getState().personTags.tagList;
                let mappings = [];

                // Iterate over values in table and map each value to a tag,
                // or to null if no matching tag could be found.
                for (let r = 0; r < table.rows.length; r++) {
                    let value = table.rows[r].values[colIndex];

                    // Map this value to a tag, if mapping doesn't already exist
                    if (!mappings.find(m => m.value === value)) {
                        let lcValue = value? value.toLowerCase() : value;
                        let tagItem = tagList.items.find(i =>
                            (i.data.title.toLowerCase() === lcValue));

                        let tags = tagItem? [ tagItem.data.id ] : [];
                        mappings.push({ value, tags });
                    }
                }

                props.config = { mappings };
            }
        }

        dispatch({
            type: types.UPDATE_IMPORT_COLUMN,
            payload: { tableId, columnId, props },
        });
    }
}

export function executeImport(tableId) {
    return ({ dispatch, getState }) => {
        let orgId = getState().org.activeId;
        let tableSet = getState().importer.tableSet;
        let tableItem = getListItemById(tableSet.tableList, tableId);
        let table = tableItem.data;

        // Create minimal representation of included columns only
        let columns = table.columnList.items
            .filter(i => i.data.included)
            .map(i => ({
                type: i.data.type,
                config: i.data.config,
            }));

        // Create minimal representation of row values, but only for those
        // columns that have been included.
        let rows = table.rows
            .filter(r => r.included)
            .map(r => r.values
                .filter((c, idx) => table.columnList.items[idx].data.included)
            );

        let data = { columns, rows, orgId };

        // TODO: Add fetch polyfill
        dispatch({
            type: types.EXECUTE_IMPORT,
            payload: {
                promise: fetch('/api/import', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
            }
        });
    };
}
