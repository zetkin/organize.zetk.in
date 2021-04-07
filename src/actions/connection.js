import * as types from './';

export function retrieveConnections(person) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_CONNECTIONS,
            meta: { person },
            payload: {
                promise: z.resource('orgs', orgId, 'people', person, 'connections').get()
            }
        });
    }
}

export function deleteConnection(person, connectionOrg) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_CONNECTION,
            meta: { person },
            payload: {
                promise: z.resource('orgs', orgId, 'people', person, 'connections', connectionOrg).del()
            }
        });
    }
}
