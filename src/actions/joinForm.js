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

export function createJoinForm(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        if (!data.hasOwnProperty('fields')) {
            data = Object.assign({}, data, {
                fields: [
                    // By default include first_name and last_name
                    'first_name',
                    'last_name',
                ],
            });
        }

        dispatch({
            type: types.CREATE_JOIN_FORM,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_forms').post(data),
            }
        });
    };
}

export function deleteJoinForm(formId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_JOIN_FORM,
            meta: { formId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_forms', formId).del(),
            }
        });
    };
}

export function updateJoinForm(formId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_JOIN_FORM,
            meta: { formId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_forms', formId).patch(data),
            }
        });
    };
}

export function retrieveJoinForm(formId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_JOIN_FORM,
            meta: { formId },
            payload: {
                promise: z.resource('orgs', orgId, 'join_forms', formId).get(),
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

export function retrieveJoinSubmissions(formId = null, state = null, page = 0, perPage = 20) {
    return ({ dispatch, getState, z }) => {
        const filters = [];
        let orgId = getState().org.activeId;
        let promise;

        if(state !== null) {
            state = state ? (state == 'accepted' ? 1 : 0) : null;
            filters.push(['state', '==', state ? 1 : 0]);
        }

        if (formId) {
            promise = z.resource('orgs', orgId, 'join_forms', formId, 'submissions')
                .get(page, perPage, filters);
        } else {
            promise = z.resource('orgs', orgId, 'join_submissions')
                .get(page, perPage, filters);
        }

        dispatch({
            type: types.RETRIEVE_JOIN_SUBMISSIONS,
            meta: { page, state, formId },
            payload: {
                promise: promise,
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
