import * as types from '../actions';
import {
    createList,
    createListItems,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem,
} from '../utils/store';


export default function surveySubmissions(state = null, action) {
    if (action.type == types.RETRIEVE_SURVEY_SUBMISSIONS + '_PENDING') {
        const filters = {
            linked: action.meta.linked,
            survey: action.meta.surveyId,
        };

        if (action.meta.surveyId != state.filters.survey || action.meta.linked != state.filters.linked) {
            return Object.assign({}, state, {
                filters,
                submissionList: createList(null, {
                    isPending: true,
                    error: null,
                }),
            });
        }
        else {
            return Object.assign({}, state, {
                filters,
                submissionList: Object.assign({}, state.submissionList, {
                    isPending: true,
                    error:null,
                })
            });
        }
    }
    else if (action.type == types.RETRIEVE_SURVEY_SUBMISSIONS + '_FULFILLED') {
        return Object.assign({}, state, {
            submissionList: updateOrAddListItems(state.submissionList, action.payload.data.data, {
                isPending: false,
                error: null,
                lastPage: Math.max(state.submissionList.lastPage, action.meta.page),
            })
        });
    }
    else if (action.type == types.RETRIEVE_SURVEY_SUBMISSIONS + '_REJECTED') {
        return Object.assign({}, state, {
            submissionList: {
                isPending: false,
                error: action.payload,
            }
        });
    }
    else if (action.type == types.RETRIEVE_SURVEY_SUBMISSION + '_PENDING') {
        const submissionData = { id: action.meta.id };
        return Object.assign({}, state, {
            submissionList: updateOrAddListItem(state.submissionList,
                    submissionData.id, submissionData, { isPending: true }),
        });
    }
    else if (action.type == types.UPDATE_SURVEY_SUBMISSION + '_FULFILLED'
     || action.type == types.RETRIEVE_SURVEY_SUBMISSION + '_FULFILLED') {
        const submissionData = action.payload.data.data
        return Object.assign({}, state, {
            submissionList: updateOrAddListItem(state.submissionList,
                submissionData.id, submissionData, { isPending: false, error: null }),
        });
    }
    else if (action.type == types.DELETE_SURVEY_SUBMISSION + '_FULFILLED') {
        return Object.assign({}, state, {
            submissionList: removeListItem(state.submissionList, action.meta.id),
        });
    }
    else {
        return state || {
            submissionList: createList(),
            filters: {},
        };
    }
}
