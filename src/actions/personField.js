import * as types from './';

export function retrieveFieldsForPerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_FIELDS_FOR_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', id, 'fields').get()
            }
        });
    };
}

export function retrieveFieldTypesForOrganization() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_FIELDS_FOR_ORGANIZATION,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'fields').get()
            }
        });
    };
}

export function createPersonField(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_PERSON_FIELD,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'fields').post(data)
            }
        });
    };
}

export function updatePersonField(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_PERSON_FIELD,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'fields', id).patch(data)
            }
        });
    };
}

export function deletePersonField(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_PERSON_FIELD,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'fields', id).del(),
            }
        });
    };
}
