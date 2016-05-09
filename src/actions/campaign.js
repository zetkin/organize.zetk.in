import Z from 'zetkin';

import * as types from './';


export function createCampaign(data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_CAMPAIGN,
            payload: {
                promise: Z.resource('orgs', orgId, 'campaigns').post(data),
            }
        });
    };
}

export function retrieveCampaigns() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_CAMPAIGNS,
            payload: {
                promise: Z.resource('orgs', orgId, 'campaigns').get(),
            }
        });
    };
}

export function retrieveCampaign(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'campaigns', id).get(),
            }
        });
    };
}

export function updateCampaign(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'campaigns', id).patch(data),
            }
        });
    };
}

export function deleteCampaign(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_CAMPAIGN,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'campaigns', id).del(),
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
