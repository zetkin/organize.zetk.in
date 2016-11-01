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
                .then(res => res.json()),
            }
        });
    };
}
