import * as types from '.';


export function retrieveAddresses() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ADDRESSES,
            payload: {
                promise: z.resource('orgs', orgId, 'addresses').get(),
            },
        });
    };
}
