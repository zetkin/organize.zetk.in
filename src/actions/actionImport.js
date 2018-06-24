import * as types from '.';

import { parseWorkbook } from '../utils/import';


export function parseActionImportFile(file) {
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
        type: types.PARSE_ACTION_IMPORT_FILE,
        payload: { promise },
    };
}
