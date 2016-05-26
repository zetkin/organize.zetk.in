import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function personTags(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_PERSON_TAGS + '_FULFILLED':
            return Object.assign({}, state, {
                tagList: createList(action.payload.data.data),
            });

        case types.RETRIEVE_TAGS_FOR_PERSON + '_FULFILLED':
            return Object.assign({}, state, {
                tagList: updateOrAddListItems(state.tagList,
                    action.payload.data.data)
            });

        case types.CREATE_PERSON_TAG + '_FULFILLED':
            let tag = action.payload.data.data;
            return Object.assign({}, state, {
                tagList: updateOrAddListItem(state.tagList,
                    tag.id, tag)
            });

        default:
            return state || {
                tagList: createList()
            };
    }
}
