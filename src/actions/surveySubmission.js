import * as types from '.';


export function retrieveSurveySubmissions(surveyId = null, linked = null, page = 0, perPage = 20) {
    return ({ dispatch, getState, z }) => {
        const filters = [];
        const orgId = getState().org.activeId;
        let promise;

        if (linked !== null) {
            linked = linked ? ((linked == 'linked') ? 1 : 0) : null;
            filters.push(['linked', '==', linked ? 1 : 0]);
        }

        if (surveyId) {
            promise = z.resource('orgs', orgId, 'surveys', surveyId,
                'submissions').get(page, perPage, filters);
        }
        else {
            promise = z.resource('orgs', orgId, 'survey_submissions')
                .get(page, perPage, filters);
        }

        dispatch({
            type: types.RETRIEVE_SURVEY_SUBMISSIONS,
            meta: { page, linked, surveyId },
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

export function deleteSurveySubmission(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_SURVEY_SUBMISSION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'survey_submissions', id).del(),
            }
        });
    };
}
