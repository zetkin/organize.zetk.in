import * as types from '.';


export function executeBulkOperation(op, objects, config) {
    return ({ dispatch, getState }) => {
        let orgId = getState().org.activeId;
        let data = { orgId, op, objects, config };

        dispatch({
            type: types.EXECUTE_BULK_OPERATION,
            payload: {
                promise: fetch('/api/bulk', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    let disp = res.headers.get('content-disposition');
                    let saveAs = require('browser-filesaver').saveAs;

                    if (disp.indexOf('attachment') === 0) {
                        let filename = 'file.dat';
                        let fnIdx = disp.indexOf('filename=');
                        if (fnIdx) {
                            filename = disp.substring(fnIdx + 10,
                                disp.length - 1);
                        }

                        return res.blob()
                            .then(blob => {
                                saveAs(blob, filename);
                            });
                    }
                    else {
                        return res.json();
                    }
                }),
            }
        });
    };
}
