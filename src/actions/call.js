import Z from 'zetkin';

import * as types from '.';


export function retrieveCalls() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALLS,
            payload: {
                promise: Z.resource('orgs', orgId, 'calls').get(),
            }
        });
    };
}

export function retrieveCall(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'calls', id).get()
            }
        });
    };
}
