import * as types from '.';

export function createSmsDistribution(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_SMS_DISTRIBUTION,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions')
                    .post(data)
            },
        });
    };
}

export function retrieveSmsDistributions() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTIONS,
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions').get(),
            },
        });
    };
}

export function retrieveSmsDistribution(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions', id).get()
            }
        });
    };
}

export function retrieveSmsDistributionStats(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTION_STATS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions', id,
                    'stats').get()
            }
        });
    };
}

export function retrieveSmsDistributionTargets(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTION_TARGETS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions', id,
                    'targets').get()
            }
        });
    };
}

export function retrieveSmsDistributionMessages(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTION_MESSAGES,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions', id,
                    'messages').get()
            }
        });
    };
}

export function updateSmsDistribution(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        return dispatch({
            type: types.UPDATE_SMS_DISTRIBUTION,
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distributions', id)
                    .patch(data),
            },
        });
    }
}

export function retrieveSmsDistributionCredits() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SMS_DISTRIBUTION_CREDITS,
            payload: {
                promise: z.resource('orgs', orgId, 'sms_distribution_credits')
                    .get()
            }
        });
    };
}
