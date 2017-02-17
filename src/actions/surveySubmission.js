import * as types from '.';


export function retrieveSurveySubmissions() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_SURVEY_SUBMISSIONS,
            payload: {
                promise: z.resource('orgs', orgId, 'survey_submissions').get(),
            }
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
