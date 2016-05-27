import xlsx from 'xlsx';

import makeRandomString from './makeRandomString';


export function parseWorkbook(data) {
    let wb = xlsx.read(data, { type: 'binary' });

    let tableSet = {
        tables: [],
    };

    wb.SheetNames.forEach(name => {
        let sheet = wb.Sheets[name];
        if ('!ref' in sheet) {
            let range = xlsx.utils.decode_range(sheet['!ref']);

            let table = {
                id: '$' + makeRandomString(6),
                name: name,
                columns: [],
                rows: [],
            };

            for (let c = range.s.c; c < range.e.c; c++) {
                table.columns.push({
                    id: '$' + makeRandomString(6),
                    name: '',
                    included: true,
                    type: 'unknown',
                });
            }

            for (let r = range.s.r; r < range.e.r; r++) {
                let rowValues = table.columns.map((col, idx) => {
                    let addr = xlsx.utils.encode_cell({ r, c: idx });
                    let cell = sheet[addr];
                    return cell? cell.v : undefined;
                });

                table.rows.push({
                    included: true,
                    values: rowValues,
                });
            }

            tableSet.tables.push(table);
        }
    });

    return tableSet;
}
