import * as types from '../actions';
import {
    createList,
    createListItems,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem,
} from '../utils/store';



export default function surveySubmissions(state = null, action) {
    let submissionData;

    switch (action.type) {
        case types.RETRIEVE_SURVEY_SUBMISSIONS + '_PENDING':
            return Object.assign({}, state, {
                submissionList: Object.assign({}, state.submissionList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_SURVEY_SUBMISSIONS + '_FULFILLED':
            return Object.assign({}, state, {
                submissionList: updateOrAddListItems(state.submissionList,
                    action.payload.data.data, { isPending: false })
            });

        case types.RETRIEVE_SURVEY_SUBMISSIONS + '_REJECTED':
            return Object.assign({}, state, {
                submissionList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_SURVEY_SUBMISSION + '_PENDING':
            submissionData = { id: action.meta.id };
            return Object.assign({}, state, {
                submissionList: updateOrAddListItem(state.submissionList,
                        submissionData.id, submissionData, { isPending: true }),
            });

        case types.UPDATE_SURVEY_SUBMISSION + '_FULFILLED':
        case types.RETRIEVE_SURVEY_SUBMISSION + '_FULFILLED':
            submissionData = action.payload.data.data
            return Object.assign({}, state, {
                submissionList: updateOrAddListItem(state.submissionList,
                    submissionData.id, submissionData, { isPending: false, error: null }),
            });

        default:
            return state || {
                submissionList: createList(),
            };
    }
}
