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
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSIONS + '_PENDING') {
        const filters = {
            formId: action.meta.formId,
            accepted: action.meta.accepted,
        }
        if (action.meta.formId != state.submissionFilters.formId || action.meta.accepted != state.submissionFilters.accepted) {
            return Object.assign({}, state, {
                submissionFilters: filters,
                submissionList: createList(null, {
                    isPending: true,
                    error: null,
                    lastPage: action.meta.page,
                }),
            });
        }
        else {
            return Object.assign({}, state, {
                submissionFilters: filters,
                submissionList: Object.assign({}, state.submissionList, {
                    isPending: true,
                    error:null,
                    lastPage: action.meta.page,
                })
            });
        }
    }
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSIONS + '_FULFILLED') {
        return Object.assign({}, state, {
            submissionList: updateOrAddListItems(state.submissionList, action.payload.data.data, {
                isPending: false,
                error: null,
                lastPage: action.meta.page,
            }),
        });
    }
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSION + '_FULFILLED'
        || action.type == types.ACCEPT_JOIN_SUBMISSION + '_FULFILLED') {

        const sub = action.payload.data.data;
        return Object.assign({}, state, {
            submissionList: updateOrAddListItem(state.submissionList, sub.id, sub,
                { isPending: false, error: null }),
        });
    }
    else {
        return state || {
            formList: createList(),
            submissionList: createList(),
            submissionFilters: {},
        };
    }
}
