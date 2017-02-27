import xlsx from 'xlsx';

import makeRandomString from './makeRandomString';
import { createList, createListItem } from './store';


export function parseWorkbook(data) {
    let wb = xlsx.read(data, { type: 'binary', cellStyles: true });

    let tableSet = {
        tableList: createList(),
    };

    wb.SheetNames.forEach(name => {
        let sheet = wb.Sheets[name];
        if ('!ref' in sheet) {
            let range = xlsx.utils.decode_range(sheet['!ref']);

            let table = {
                id: '$' + makeRandomString(6),
                name: name,
                numEmptyColumnsRemoved: 0,
                useFirstRowAsHeader: false,
                // Columns are often operated on by ID and will benefit from
                // being stored as a standardized list structure. Rows are
                // rarely operated upon individually and can be kept simple.
                columnList: createList(),
                rows: [],
            };

            for (let c = range.s.c; c <= range.e.c; c++) {
                table.columnList.items.push(createListItem({
                    id: '$' + makeRandomString(6),
                    name: '',
                    included: true,
                    type: 'unknown',
                }));
            }

            for (let r = range.s.r; r <= range.e.r; r++) {
                let rowValues = table.columnList.items.map((col, idx) => {
                    let addr = xlsx.utils.encode_cell({ r, c: idx });
                    let cell = sheet[addr];
                    return cell? cell.v : undefined;
                });

                // Only include if there are non-null values in the row
                if (!!rowValues.find(v => v != null)) {
                    table.rows.push({
                        included: true,
                        values: rowValues,
                    });
                }
            }

            // Iterate from right to left, finding completely empty columns
            // and removing them, storing the number of removed columns.
            for (let c = (range.e.c - range.s.c); c >= 0; c--) {
                let empty = true;
                for (let r = 0; r < table.rows.length; r++) {
                    let val = table.rows[r].values[c];
                    if (val !== undefined) {
                        empty = false;
                        break;
                    }
                }

                if (empty) {
                    // Remove empty column, including values from all rows
                    table.numEmptyColumnsRemoved++;
                    table.columnList.items.splice(c, 1);
                    for (let r = 0; r < table.rows.length; r++) {
                        table.rows[r].values.splice(c, 1);
                    }
                }
            }

            // If there are more than one row in the sheet, analyze whether
            // first row was likely intended as a header, and set default.
            if ((range.e.r - range.s.r) > 1) {
                let numDifferentFormats = 0;

                for (let c = range.s.c; c <= range.e.c; c++) {
                    let addr0 = xlsx.utils.encode_cell({ r: 0, c });
                    let addr1 = xlsx.utils.encode_cell({ r: 1, c });
                    let cell0 = sheet[addr0];
                    let cell1 = sheet[addr1];

                    if (cell0 && cell1 && cell0.ixfe !== cell1.ixfe) {
                        // Cells in first and second row have different
                        // formats, likely because first is header
                        numDifferentFormats++;
                    }
                }

                // If more than 80% of the columns had different styles on the
                // first and second rows, assume that the first row is intended
                // as a header. Remove the first row, moving it's values to the
                // name field of each column.
                let threshold = 0.8 * (range.e.c - range.s.c);
                if (numDifferentFormats > threshold) {
                    table.useFirstRowAsHeader = true;
                    table.columnList.items.forEach((colItem, idx) => {
                        colItem.data.name = table.rows[0].values[idx];

                        // Try to figure out type by name
                        let cfg = guessColumnConfigFromName(colItem.data.name);
                        if (cfg) {
                            colItem.data.type = cfg.type;
                            colItem.data.config = cfg.config;
                        }
                    });

                    table.rows.splice(0, 1);
                }
            }

            tableSet.tableList.items.push(createListItem(table));
        }
    });

    return tableSet;
}

function guessColumnConfigFromName(name) {
    let type, config;

    // TODO: Evolve this function. Add common, localized names
    if (name.toLowerCase() == 'id') {
        type = 'person_data';
        config = {
            field: 'id'
        };
    }

    if (type && config) {
        return { type, config };
    }
}
