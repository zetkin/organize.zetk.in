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
