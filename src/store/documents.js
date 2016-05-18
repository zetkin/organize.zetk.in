import * as types from '../actions';
import {
    createList,
    removeListItem,
    updateOrAddListItem,
} from '../utils/store';

export default function documents(state = null, action) {
    switch (action.type) {
        case types.CREATE_TEXT_DOCUMENT:
        case types.SAVE_TEXT_DOCUMENT:
            let doc = action.payload;
            return Object.assign({}, state, {
                docList: updateOrAddListItem(state.docList, doc.id, doc),
            });

        case types.FINISH_DOCUMENT:
            let id = action.payload.id;
            return Object.assign({}, state, {
                docList: removeListItem(state.docList, id),
            });

        default:
            return state || {
                docList: createList(),
            };
    }
}
