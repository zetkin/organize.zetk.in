import * as types from '../actions';

import { createList } from '../utils/store';


export default function personTags(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_PERSON_TAGS + '_FULFILLED':
            return Object.assign({}, state, {
                tagList: createList(action.payload.data.data),
            });

        default:
            return state || {
                tagList: createList()
            };
    }
}
