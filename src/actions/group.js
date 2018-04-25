import * as types from './';


export function retrieveGroup(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_GROUP,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'groups', id)
                    .get(),
            }
        });
    };
}

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
