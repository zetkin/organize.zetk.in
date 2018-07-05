import * as types from '.';


export function retrieveActionResponses(actionId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ACTION_RESPONSES,
            meta: { actionId },
            payload: {
                promise: z.resource('orgs', orgId, 'actions', actionId,
                    'responses').get(),
            }
        });
    };
}

export function deleteActionResponse(actionId, personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_ACTION_RESPONSE,
            meta: { actionId, personId },
            payload: {
                promise: z.resource('orgs', orgId, 'actions', actionId,
                    'responses', personId).del(),
            }
        });
    };
}
