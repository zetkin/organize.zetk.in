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
    let elements;
    let surveyId, elementId, optionId;

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

        case types.CREATE_SURVEY + '_FULFILLED':
        case types.UPDATE_SURVEY + '_FULFILLED':
        case types.RETRIEVE_SURVEY + '_FULFILLED':
            surveyData = action.payload.data.data
            elements = surveyData.elements;

            // Elements go in separate list
            delete surveyData['elements'];

            return Object.assign({}, state, {
                elementsBySurvey: Object.assign({}, state.elementsBySurvey, {
                    [surveyData.id.toString()]: createList(elements),
                }),
                surveyList: updateOrAddListItem(state.surveyList,
                    surveyData.id, surveyData, { isPending: false, error: null }),
            });

        case types.DELETE_SURVEY + '_FULFILLED':
            return Object.assign({}, state, {
                surveyList: removeListItem(state.surveyList, action.meta.id)
            });

        case types.CREATE_SURVEY_ELEMENT + '_FULFILLED':
        case types.UPDATE_SURVEY_ELEMENT + '_FULFILLED':
            surveyId = action.meta.surveyId.toString();
            return Object.assign({}, state, {
                elementsBySurvey: Object.assign({}, state.elementsBySurvey, {
                    [surveyId]: updateOrAddListItem(
                        state.elementsBySurvey[surveyId],
                        action.payload.data.data.id,
                        action.payload.data.data),
                })
            });

        case types.REORDER_SURVEY_ELEMENTS + '_FULFILLED':
            surveyId = action.meta.surveyId.toString()
            let defaultOrder = action.payload.data.data.default;

            return Object.assign({}, state, {
                elementsBySurvey: Object.assign({}, state.elementsBySurvey, {
                    [surveyId]: Object.assign({}, state.elementsBySurvey[surveyId], {
                        items: state.elementsBySurvey[surveyId].items
                            .concat()
                            .sort((i0, i1) => {
                                let idx0 = defaultOrder.indexOf(i0.data.id);
                                let idx1 = defaultOrder.indexOf(i1.data.id);

                                return idx0 - idx1;
                            }),
                    })
                }),
            });

        case types.UPDATE_SURVEY_OPTION + '_FULFILLED':
            surveyId = action.meta.surveyId;
            elementId = action.meta.elementId;
            optionId = action.meta.optionId;
            let element = state.elementsBySurvey[surveyId].items
                .find(i => i.data.id == elementId).data;
            let option = element.question.options
                .find(o => o.id == optionId);
            let optionIdx = element.question.options.indexOf(option);
            let options = element.question.options.concat();
            options[optionIdx] = action.payload.data.data;

            return Object.assign({}, state, {
                elementsBySurvey: Object.assign({}, state.elementsBySurvey, {
                    [surveyId]: updateOrAddListItem(
                        state.elementsBySurvey[surveyId],
                        elementId, Object.assign({}, element, {
                            question: Object.assign({}, element.question, {
                                options: options,
                            }),
                        })),
                })
            });

        case types.CREATE_SURVEY_OPTION + '_FULFILLED':
            surveyId = action.meta.surveyId;
            elementId = action.meta.elementId;
            optionId = action.meta.optionId;
            element = state.elementsBySurvey[surveyId].items
                .find(i => i.data.id == elementId).data;

            return Object.assign({}, state, {
                elementsBySurvey: Object.assign({}, state.elementsBySurvey, {
                    [surveyId]: updateOrAddListItem(
                        state.elementsBySurvey[surveyId],
                        elementId, Object.assign({}, element, {
                            question: Object.assign({}, element.question, {
                                options: element.question.options.concat(
                                    [ action.payload.data.data ])
                            }),
                        })),
                })
            });

        default:
            return state || {
                surveyList: createList(),
                elementsBySurvey: {},
            };
    }
}
