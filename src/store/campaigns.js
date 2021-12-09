import {
    createList,
    createListItems,
    updateOrAddListItem,
    removeListItem,
} from '../utils/store';

import * as types from '../actions';


export default function campaigns(state = null, action) {
    let campaign;

    switch (action.type) {
        case types.RETRIEVE_CAMPAIGNS + '_PENDING':
            return Object.assign({}, state, {
                campaignList: Object.assign({}, state.campaignList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_CAMPAIGNS + '_FULFILLED':
            return Object.assign({}, state, {
                campaignList: {
                    isPending: false,
                    error: null,
                    recursive: action.meta.recursive,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_CAMPAIGNS + '_REJECTED':
            return Object.assign({}, state, {
                campaignList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_CAMPAIGN + '_PENDING':
            campaign = { id: action.meta.id };
            return Object.assign({}, state, {
                campaignList: updateOrAddListItem(state.campaignList,
                        campaign.id, campaign, { pending: true }),
            });

        case types.CREATE_CAMPAIGN + '_FULFILLED':
        case types.UPDATE_CAMPAIGN + '_FULFILLED':
        case types.RETRIEVE_CAMPAIGN + '_FULFILLED':
            campaign = action.payload.data.data
            return Object.assign({}, state, {
                campaignList: updateOrAddListItem(state.campaignList,
                    campaign.id, campaign, { pending: false, error: null }),
            });

        case types.DELETE_CAMPAIGN + '_FULFILLED':
            return Object.assign({}, state, {
                campaignList: removeListItem(state.campaignList,
                    action.meta.id, { pending: false, error: null }),
            });

        case types.SELECT_CAMPAIGN:
            return Object.assign({}, state, {
                selectedCampaign: action.payload.id,
            });

        default:
            return state || {
                campaignList: createList(),
                selectedCampaign: null
            };
    }
}
