import * as types from '../actions';

import {
    createList,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function joinForms(state = null, action) {
    if (action.type == types.DELETE_JOIN_FORM + '_FULFILLED') {
        return Object.assign({}, state, {
            formList: removeListItem(state.formList, action.meta.formId),
        });
    }
    else if (action.type == types.CREATE_JOIN_FORM + '_FULFILLED'
        || action.type == types.RETRIEVE_JOIN_FORM + '_FULFILLED'
        || action.type == types.UPDATE_JOIN_FORM + '_FULFILLED') {
        const form = action.payload.data.data;
        return Object.assign({}, state, {
            formList: updateOrAddListItem(state.formList, form.id, form),
        });
    }
    else if (action.type == types.RETRIEVE_JOIN_FORMS + '_FULFILLED') {
        return Object.assign({}, state, {
            formList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSIONS + '_FULFILLED') {
        const filters = {
            state: action.meta.state,
            form: action.meta.formId,
        };
        return Object.assign({}, state, {
            submissionList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSION + '_FULFILLED'
        || action.type == types.ACCEPT_JOIN_SUBMISSION + '_FULFILLED') {

        const sub = action.payload.data.data;
        return Object.assign({}, state, {
            submissionList: updateOrAddListItem(state.submissionList, sub.id, sub),
        });
    }
    else {
        return state || {
            formList: createList(),
            submissionList: createList(),
        };
    }
}
