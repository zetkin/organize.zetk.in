import * as types from '.';


export function retrieveSurveys() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEYS,
            payload: {
                promise: z.resource('orgs', orgId, 'surveys').get(),
            },
            meta: {
                recursive: false,
            }
        });
    };
}

export function retrieveSurveysRecursive() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEYS,
            payload: {
                promise: z.resource('orgs', orgId, 'surveys?recursive').get(),
            },
            meta: {
                recursive: true,
            }
        });
    };
}

export function createSurvey(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_SURVEY,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys').post(data),
            }
        });
    };
}

export function retrieveSurvey(id) {
    return ({ dispatch, getState, z }) => {
        let orgId;
        let survey;
        if(survey.surveyList && survey.surveyList.items) {
            survey = getState().surveys.surveyList.items.find(i => i.data.id == id);
        }
        if(survey) {
            orgId = survey.data.organization.id;
        } else {
            orgId = getState().org.activeId;
        }
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

export function createSurveyElement(surveyId, data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_SURVEY_ELEMENT,
            meta: { surveyId, paneId },
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

export function createSurveyOptions(surveyId, elementId, options) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        // Dispatch CREATE_SURVEY_OPTION actions in sequence
        let promise = Promise.resolve();
        options.forEach(option => {
            promise = promise
                .then(() => {
                    const req = z.resource('orgs', orgId, 'surveys', surveyId,
                        'elements', elementId, 'options').post(option)

                    dispatch({
                        type: types.CREATE_SURVEY_OPTION,
                        meta: { surveyId, elementId },
                        payload: {
                            promise: req,
                        },
                    });

                    return req;
                });
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

export function deleteSurveyOption(surveyId, elementId, optionId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_SURVEY_OPTION,
            meta: { surveyId, elementId, optionId },
            payload: {
                promise: z.resource('orgs', orgId, 'surveys', surveyId,
                    'elements', elementId, 'options', optionId).del()
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
