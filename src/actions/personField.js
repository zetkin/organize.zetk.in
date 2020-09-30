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
