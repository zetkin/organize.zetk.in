import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function personViews(state = null, action) {
    if (action.type == types.RETRIEVE_PERSON_VIEWS + '_FULFILLED') {
        return Object.assign({}, state, {
            viewList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEWS + '_PENDING') {
        return Object.assign({}, state, {
            viewList: Object.assign(state.viewList, { isPending: true }),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW + '_FULFILLED') {
        const view = action.payload.data.data;
        return Object.assign({}, state, {
            viewList: updateOrAddListItem(state.viewList, view.id, view),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_COLUMNS + '_FULFILLED') {
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [action.meta.viewId]: createList(action.payload.data.data),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_COLUMNS + '_PENDING') {
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [action.meta.viewId]: createList(null, { isPending: true }),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROWS + '_FULFILLED') {
        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [action.meta.viewId]: createList(action.payload.data.data),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROWS + '_PENDING') {
        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [action.meta.viewId]: createList(null, { isPending: true }),
            })
        });
    }
    else {
        return state || {
            viewList: createList(),
            columnsByView: {},
            rowsByView: {},
        };
    }
}
