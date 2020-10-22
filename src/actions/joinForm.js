import * as types from '.';


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
