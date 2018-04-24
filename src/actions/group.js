import * as types from './';


export function retrieveGroups() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_GROUPS,
            payload: {
                promise: z.resource('orgs', orgId, 'groups')
                    .get(),
            }
        });
    };
}
