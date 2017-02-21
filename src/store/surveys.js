import * as types from '../actions';
import {
    createList,
    createListItems,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem,
} from '../utils/store';



export default function surveys(state = null, action) {
    let surveyData;

    switch (action.type) {
        case types.RETRIEVE_SURVEYS + '_PENDING':
            return Object.assign({}, state, {
                surveyList: Object.assign({}, state.surveyList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_SURVEYS + '_FULFILLED':
            return Object.assign({}, state, {
                surveyList: updateOrAddListItems(state.surveyList,
                    action.payload.data.data, { isPending: false })
            });

        case types.RETRIEVE_SURVEYS + '_REJECTED':
            return Object.assign({}, state, {
                surveyList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_SURVEY + '_PENDING':
            surveyData = { id: action.meta.id };
            return Object.assign({}, state, {
                surveyList: updateOrAddListItem(state.surveyList,
                        surveyData.id, surveyData, { isPending: true }),
            });

        case types.UPDATE_SURVEY + '_FULFILLED':
        case types.RETRIEVE_SURVEY + '_FULFILLED':
            surveyData = action.payload.data.data
            return Object.assign({}, state, {
                surveyList: updateOrAddListItem(state.surveyList,
                    surveyData.id, surveyData, { isPending: false, error: null }),
            });

        default:
            return state || {
                surveyList: createList(),
            };
    }
}
