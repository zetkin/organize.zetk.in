import * as types from '.';

export function createLocationTag(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_LOCATION_TAG,
            payload: {
                promise: z.resource('orgs', orgId, 'locations', 'tags').post(data)
            }
        });
    };
}

export function retrieveLocationTag(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_LOCATION_TAG,
            payload: {
                promise: z.resource('orgs', orgId, 'locations', 'tags', id).get()
            }
        });
    };
}

export function retrieveLocationTags() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_LOCATION_TAGS,
            payload: {
                promise: z.resource('orgs', orgId, 'locations', 'tags').get(),
            }
        });
    };
}

export function retrieveTagsForLocation(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_TAGS_FOR_LOCATION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'locations', id, 'tags').get()
            }
        });
    };
}

export function updateLocationTag(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_LOCATION_TAG,
            payload: {
                promise: z.resource('orgs', orgId,
                    'locations', 'tags', id).patch(data)
            }
        });
    };
}

export function addTagsToLocation(id, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId =>
            z.resource('orgs', orgId, 'locations', id, 'tags', tagId).put());

        dispatch({
            type: types.ADD_TAGS_TO_LOCATION,
            meta: { id, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

export function removeTagFromLocation(id, tagId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_TAG_FROM_LOCATION,
            meta: { id, tagId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'locations', id, 'tags', tagId).del(),
            }
        });
    };
}
