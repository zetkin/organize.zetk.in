import * as types from '.';


export function createPersonTag(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_PERSON_TAG,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'tags').post(data)
            }
        });
    };
}

export function retrievePersonTag(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAG,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'tags', id).get()
            }
        });
    };
}

export function retrievePersonTags() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAGS,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'tags').get(),
            },
            meta: {
                recursive: false,
            }
        });
    };
}

export function retrievePersonTagsRecursive() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAGS,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'tags?recursive').get(),
            },
            meta: {
                recursive: true,
            }
        });
    };
}

export function retrieveTagsForPerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_TAGS_FOR_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', id, 'tags').get()
            }
        });
    };
}

export function updatePersonTag(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_PERSON_TAG,
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'tags', id).patch(data)
            }
        });
    };
}

export function addTagsToPerson(id, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId =>
            z.resource('orgs', orgId, 'people', id, 'tags', tagId).put());

        dispatch({
            type: types.ADD_TAGS_TO_PERSON,
            meta: { id, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

export function removeTagFromPerson(id, tagId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_TAG_FROM_PERSON,
            meta: { id, tagId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', id, 'tags', tagId).del(),
            }
        });
    };
}

export function deletePersonTag(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_TAG,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'tags', id).del(),
            }
        });
    };
}
