import * as types from '.';


export function retrieveOfficials() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_OFFICIALS,
            payload: {
                promise: z.resource('orgs', orgId, 'officials').get()
            }
        });
    };
}

export function setOfficialRole(personId, role) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.SET_OFFICIAL_ROLE,
            meta: { personId, role },
            payload: {
                promise: z.resource('orgs', orgId, 'officials', personId)
                    .put({ role })
            }
        });
    };
}

export function setOfficialsRole(personIds, role) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = personIds.map(id =>
            z.resource('orgs', orgId, 'officials', id).put({ role }));

        dispatch({
            type: types.SET_OFFICIALS_ROLE,
            payload: {
                promise: Promise.all(promises)
            }
        });
    };
}

export function deleteOfficial(personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_OFFICIAL,
            meta: { personId },
            payload: {
                promise: z.resource('orgs', orgId, 'officials', personId).del()
            }
        });
    };
}
