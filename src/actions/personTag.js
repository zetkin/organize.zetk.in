import Z from 'zetkin';

import * as types from '.';


export function createPersonTag(data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_PERSON_TAG,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'tags').post(data)
            }
        });
    };
}

export function retrievePersonTag(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAG,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'tags', id).get()
            }
        });
    };
}

export function retrievePersonTags() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAGS,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'tags').get(),
            }
        });
    };
}

export function retrieveTagsForPerson(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_TAGS_FOR_PERSON,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', id, 'tags').get()
            }
        });
    };
}

export function updatePersonTag(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_PERSON_TAG,
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', 'tags', id).patch(data)
            }
        });
    };
}

export function addTagsToPerson(id, tagIds) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId =>
            Z.resource('orgs', orgId, 'people', id, 'tags', tagId).put());

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
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_TAG_FROM_PERSON,
            meta: { id, tagId },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', id, 'tags', tagId).del(),
            }
        });
    };
}
