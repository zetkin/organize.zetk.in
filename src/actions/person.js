import * as types from './';


export function createPerson(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_PERSON,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'people').post(data)
            }
        });
    };
}

export function retrievePeople(page = 0, perPage = 20) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PEOPLE,
            meta: { page },
            payload: {
                promise: z.resource('orgs', orgId, 'people')
                    .get(page, perPage)
            }
        });
    };
}

export function retrievePerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).get()
            }
        });
    };
}

export function updatePerson(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_PERSON,
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).patch(data)
            }
        });
    };
}

export function deletePerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).del()
            }
        });
    };
}

export function findDuplicates() {
    return ({ dispatch, getState }) => {
        let orgId = getState().org.activeId;
        let options = {
            credentials: 'include',
        };

        dispatch({
            type: types.FIND_PERSON_DUPLICATES,
            payload: {
                promise: fetch('/api/duplicates/' + orgId + '/people', options)
                    .then(res => res.json()),
            },
        });
    };
}

export function clearDuplicates() {
    return {
        type: types.CLEAR_PERSON_DUPLICATES,
    };
}

export function mergeDuplicates(dupData, override, paneId) {
    return ({ dispatch, getState, z }) => {
        let { id, objects } = dupData;
        let orgId = getState().org.activeId;
        let data = {
            type: 'person',
            objects, override,
        };

        dispatch({
            type: types.MERGE_PERSON_DUPLICATES,
            meta: { id, objects, paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'merges').post(data),
            },
        });
    };
}
