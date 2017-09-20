import * as types from '.';


export function retrieveSurveySubmissions(surveyId = null) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let promise;

        if (surveyId) {
            promise = z.resource('orgs', orgId, 'surveys', surveyId,
                'submissions').get();
        }
        else {
            promise = z.resource('orgs', orgId, 'survey_submissions').get();
        }

        dispatch({
            type: types.RETRIEVE_SURVEY_SUBMISSIONS,
            meta: { surveyId },
            payload: { promise },
        });
    };
}

export function retrieveSurveySubmission(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEY_SUBMISSION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'survey_submissions', id).get(),
            }
        });
    };
}

export function updateSurveySubmission(id, data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_SURVEY_SUBMISSION,
            meta: { id, paneId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'survey_submissions', id).patch(data)
            }
        });
    };
}
