import xlsx from 'xlsx';
import papa from 'papaparse';

import makeRandomString from './makeRandomString';
import { createList, createListItem } from './store';


export function parseCSV(file) {
    return new Promise((resolve, reject) => {
        let table = {
            id: '$' + makeRandomString(6),
            name: 'CSV',
            numEmptyColumnsRemoved: 0,
            useFirstRowAsHeader: false,
            columnList: createList(),
            rows: [],
        };

        papa.parse(file, {
            complete: parsed => {
                if (parsed.errors && parsed.errors.length) {
                    reject({ error: parsed.errors });
                }
                else if (parsed.data && parsed.data.length) {
                    // If cell count varies by row, use maximum number as column count
                    const colCount = Math.max.apply(null, parsed.data.map(row => row.length));

                    while (table.columnList.items.length < colCount) {
                        table.columnList.items.push(createListItem({
                            id: '$' + makeRandomString(6),
                            name: '',
                            included: true,
                            type: 'unknown',
                        }));
                    }

                    // Ignore empty rows, and unify number of cells per row
                    table.rows = parsed.data
                        .filter(row => row.join('') != '')
                        .map(row => {
                            let values = row.concat();

                            // Add empty cells until column count is correct
                            while (values.length < colCount) {
                                values.push('');
                            }

                            return {
                                included: true,
                                values,
                            }
                        });
                }

                // Table set always contains just a single table
                resolve({
                    tableSet: {
                        tableList: createList([table]),
                    }
                });
            },
            error: err => {
                reject(err);
            },
        });
    });
}

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
                    return cell? (cell.w || cell.v) : undefined;
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

    return Promise.resolve({ tableSet });
}

function guessColumnConfigFromName(name) {
    let type, config;

    // TODO: Evolve this function. Add common, localized names
    if (name && name.toLowerCase() == 'id') {
        type = 'person_data';
        config = {
            field: 'id'
        };
    }

    if (type && config) {
        return { type, config };
    }
}

let flattenedOrgs = {};

export function flattenOrgs(org, subOrgs) {
    let orgData = org.data ? org.data : org;
    let orgId = orgData.id;
    if(flattenedOrgs[orgId]) {
        // subOrgs given a specific orgId are unlikely to change during runtime
        // to avoid unecessary caculations, cache the results per orgId
        return flattenedOrgs[orgId];
    }
    let orgs = {};
    // activeOrg contains no is_active attribute, hence allow undefined
    if(orgData.is_active || orgData.is_active === undefined) {
        orgs[orgId] = orgData.title;
    }
    if(subOrgs) {
        subOrgs.forEach(o => {
            const fo = flattenOrgs(o, o.data ? o.data.sub_orgs : o.sub_orgs);
            orgs = {...orgs, ...fo};
        })
    }
    flattenedOrgs[orgId] = orgs;
    return orgs;
}

