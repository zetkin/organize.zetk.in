import * as types from '.';

import { parseWorkbook } from '../utils/import';


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
