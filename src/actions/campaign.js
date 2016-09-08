import * as types from './';


export function createCampaign(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_CAMPAIGN,
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns').post(data),
            }
        });
    };
}

export function retrieveCampaigns() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_CAMPAIGNS,
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns').get(),
            }
        });
    };
}

export function retrieveCampaign(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns', id).get(),
            }
        });
    };
}

export function updateCampaign(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns', id).patch(data),
            }
        });
    };
}

export function deleteCampaign(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns', id).del(),
            }
        });
    };
}

export function selectCampaign(id) {
    return {
        type: types.SELECT_CAMPAIGN,
        payload: {
            id: id,
        }
    };
}
