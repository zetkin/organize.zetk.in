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
    return function(dispatch, getState) {
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

                        let tag = tagItem? tagItem.data.id : null;
                        mappings.push({ value, tag });
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
