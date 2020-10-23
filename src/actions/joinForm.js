import * as types from '.';


export function acceptJoinSubmission(submissionId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.ACCEPT_JOIN_SUBMISSION,
            meta: { submissionId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_submissions', submissionId).patch({ state: 'accepted' }),
            }
        });
    };
}

export function retrieveJoinForms() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_JOIN_FORMS,
            payload: {
                promise: z.resource('orgs', orgId, 'join_forms').get(),
            }
        });
    };
}

export function retrieveJoinSubmissions() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_JOIN_SUBMISSIONS,
            payload: {
                promise: z.resource('orgs', orgId, 'join_submissions').get(),
            }
        });
    };
}


export function retrieveJoinSubmission(submissionId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_JOIN_SUBMISSION,
            meta: { submissionId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_submissions', submissionId).get(),
            }
        });
    };
}
