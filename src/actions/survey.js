import * as types from '.';


export function retrieveSurveys() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEYS,
            payload: {
                promise: z.resource('orgs', orgId, 'surveys').get(),
            }
        });
    };
}

export function createSurvey(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_SURVEY,
            payload: {
                promise: z.resource('orgs', orgId, 'surveys').post(data),
            }
        });
    };
}

export function retrieveSurvey(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', id).get(),
            }
        });
    };
}

export function updateSurvey(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_SURVEY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', id).patch(data)
            }
        });
    };
}

export function deleteSurvey(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_SURVEY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', id).del()
            }
        });
    };
}

export function createSurveyElement(surveyId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_SURVEY_ELEMENT,
            meta: { surveyId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements').post(data)
            }
        });
    };
}

export function updateSurveyElement(surveyId, elementId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_SURVEY_ELEMENT,
            meta: { surveyId, elementId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elementId).patch(data)
            }
        });
    };
}

export function deleteSurveyElement(surveyId, elementId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_SURVEY_ELEMENT,
            meta: { surveyId, elementId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elementId).del()
            }
        });
    };
}

export function reorderSurveyElements(surveyId, order) {
    // TODO: Don't convert to ints
    order = order.map(key => parseInt(key));

    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = {
            'default': order,
        };

        dispatch({
            type: types.REORDER_SURVEY_ELEMENTS,
            meta: { surveyId, order },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'element_order').patch(data)
            }
        });
    };
}

export function createSurveyOption(surveyId, elementId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_SURVEY_OPTION,
            meta: { surveyId, elementId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elementId, 'options').post(data)
            }
        });
    };
}

export function updateSurveyOption(surveyId, elementId, optionId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_SURVEY_OPTION,
            meta: { surveyId, elementId, optionId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elementId, 'options', optionId).patch(data)
            }
        });
    };
}

export function reorderSurveyOptions(surveyId, elemId, order) {
    // TODO: Don't convert to ints
    order = order.map(key => parseInt(key));

    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = {
            'default': order,
        };

        dispatch({
            type: types.REORDER_SURVEY_OPTIONS,
            meta: { surveyId, elemId, order },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elemId, 'option_order').patch(data)
            }
        });
    };
}
