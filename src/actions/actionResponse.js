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
