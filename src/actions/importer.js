import * as types from '.';

import { parseCSV, parseWorkbook } from '../utils/import';
import { getListItemById } from '../utils/store';

const XLS_SUFFIXES = ['xlsx', 'xls'];
const CSV_SUFFIXES = ['csv'];

const hasSuffix = (name, suffixes) => {
    return !!suffixes.find(suffix => name.endsWith(suffix));
}


export function parseImportFile(file) {
    let promise = new Promise((resolve, reject) => {
        if (hasSuffix(file.name, XLS_SUFFIXES)) {
            let reader = new FileReader();

            reader.onload = e => {
                try {
                    resolve(parseWorkbook(e.target.result));
                } catch(error) {
                    reject({ error });
                }
            };

            reader.readAsBinaryString(file);
        }
        else if (hasSuffix(file.name, CSV_SUFFIXES)) {
            resolve(parseCSV(file));
        }
        else {
            reject({ error: 'Unknown file type' });
        }
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
                    field: props.config? props.config.field : 'id',
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
                        let lcValue = value? value.toString().toLowerCase() : value;
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
    return ({ dispatch, getState, z }) => {
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

        let data = { columns, rows };

        dispatch({
            type: types.EXECUTE_IMPORT,
            payload: {
                promise: z.resource('orgs', orgId, 'imports').post(data)
            }
        });
    };
}

export function resetImport() {
    return {
        type: types.RESET_IMPORT,
    };
}

export function resetImportError() {
    return {
        type: types.RESET_IMPORT_ERROR,
    }
}

export function retrieveImportLogs() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_IMPORT_LOGS,
            payload: {
                promise: z.resource('orgs', orgId, 'imports').get()
            }
        });
    };
}
