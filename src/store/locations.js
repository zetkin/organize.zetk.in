import {
    createList,
    createListItems,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem,
    getListItemById
} from '../utils/store';

import {
    CREATE_LOCATION,
    RETRIEVE_LOCATIONS,
    RETRIEVE_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION,
    CREATE_PENDING_LOCATION,
    SAVE_PENDING_LOCATION,
    FINISH_PENDING_LOCATION,
    RETRIEVE_TAGS_FOR_LOCATION,
    ADD_TAGS_TO_LOCATION,
    REMOVE_TAG_FROM_LOCATION
} from '../actions';

export default function locations(state = null, action) {
    let locItem;
    let loc;
    let tags;

    switch (action.type) {
        case RETRIEVE_LOCATIONS + '_PENDING':
            return Object.assign({}, state, {
                locationList: Object.assign({}, state.locationList, {
                    isPending: true,
                    error: null,
                }),
            });

        case RETRIEVE_LOCATIONS + '_FULFILLED':
            return Object.assign({}, state, {
                locationList: {
                    isPending: false,
                    error: null,
                    recursive: action.meta.recursive,
                    items: createListItems(action.payload.data.data),
                },
            });

        case RETRIEVE_LOCATIONS + '_REJECTED':
            return Object.assign({}, state, {
                locationList: {
                    isPending: false,
                    error: action.payload,
                },
            });

        case CREATE_LOCATION + '_FULFILLED':
        case UPDATE_LOCATION + '_FULFILLED':
        case RETRIEVE_LOCATION + '_FULFILLED':
            loc = action.payload.data.data;
            return Object.assign({}, state, {
                locationList: updateOrAddListItem(state.locationList,
                    loc.id, loc, { pending: false, error: null }),
            });

        case DELETE_LOCATION + '_FULFILLED':
            return Object.assign({}, state, {
                locationList: removeListItem(state.locationList,
                    action.meta.id),
            });

        case CREATE_PENDING_LOCATION:
            return Object.assign({}, state, {
                pendingLocationList: updateOrAddListItem(state.pendingLocationList,
                    action.payload.id, {
                        id: action.payload.id,
                        position: action.payload.position,
                        doneCallback: action.payload.doneCallback
                    }),
            });

        case SAVE_PENDING_LOCATION:
            return Object.assign({}, state, {
                pendingLocationList: updateOrAddListItem(state.pendingLocationList,
                    action.payload.id, {
                        id: action.payload.id,
                        position: action.payload.position,
                    }),
            });

        case FINISH_PENDING_LOCATION:
            return Object.assign({}, state, {
                pendingLocationList: removeListItem(state.pendingLocationList,
                    action.payload.id),
            });

        case RETRIEVE_TAGS_FOR_LOCATION + '_PENDING':
            loc = {
                id: action.meta.id,
                tagList: createList(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                locationList: updateOrAddListItem(state.locationList,
                    loc.id, loc),
            });

        case RETRIEVE_TAGS_FOR_LOCATION + '_FULFILLED':
            tags = action.payload.data.data.map(t => ({ id: t.id }));
            loc = {
                id: action.meta.id,
                tagList: createList(tags, { isPending: false }),
            };

            return Object.assign({}, state, {
                locationList: updateOrAddListItem(state.locationList,
                    loc.id, loc),
            });

        case ADD_TAGS_TO_LOCATION + '_FULFILLED':
            locItem = getListItemById(state.locationList, action.meta.id);
            if (locItem) {
                tags = action.meta.tagIds.map(id => ({ id }));
                loc = Object.assign({}, locItem.data, {
                    id: action.meta.id,
                    tagList: updateOrAddListItems(
                        locItem.data.tagList, tags)
                });

                return Object.assign({}, state, {
                    locationList: updateOrAddListItem(state.locationList,
                        loc.id, loc),
                });
            }
            else {
                return state;
            }

        case REMOVE_TAG_FROM_LOCATION + '_FULFILLED':
            locItem = getListItemById(state.locationList, action.meta.id);
            if (locItem) {
                loc = Object.assign({}, locItem.data, {
                    id: action.meta.id,
                    tagList: removeListItem(locItem.data.tagList,
                        action.meta.tagId)
                });

                return Object.assign({}, state, {
                    locationList: updateOrAddListItem(state.locationList,
                        loc.id, loc),
                });
            }
            else {
                return state;
            }

            return Object.assign({}, state, {
                locationList: updateOrAddListItem(state.locationList,
                    loc.id, loc),
            });

        default:
            return state || {
                locationList: createList(),
                pendingLocationList: createList(),
            };
    }
}
