import * as types from '../actions';
import {
    createList,
    createListItems,
    createListItem,
    updateOrAddListItem,
} from '../utils/store';


export default function smsDistributions(state = null, action) {
    switch (action.type) {
        case types.CREATE_SMS_DISTRIBUTION + '_FULFILLED': {
            const distribution = action.payload.data.data;

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(state.distributionList,
                    distribution.id, distribution),
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTIONS + '_PENDING':
            return Object.assign({}, state, {
                distributionList: Object.assign({}, state.distributionList, {
                    isPending: true,
                    error: null,
                })
            });

        case types.RETRIEVE_SMS_DISTRIBUTIONS + '_FULFILLED':
            return Object.assign({}, state, {
                distributionList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_SMS_DISTRIBUTION + '_PENDING': {
            const distribution = { id: action.meta.id };

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(state.distributionList,
                    distribution.id, distribution, { isPending: true })
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION + '_FULFILLED': {
            const distribution = action.payload.data.data;
            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(state.distributionList,
                    distribution.id, distribution, { isPending: false })
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION_STATS + '_PENDING': {
            const distribution = {
                id: action.meta.id,
                statsItem: createListItem(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(state.distributionList,
                    distribution.id, distribution),
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION_STATS + '_FULFILLED': {
            const distribution = {
                id: action.meta.id,
                statsItem: createListItem(action.payload.data.data),
            };

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(state.distributionList,
                    distribution.id, distribution),
            });
        }

        case types.UPDATE_QUERY + '_FULFILLED': {
            // Check if there is an distribution that uses this query
            let queryId = action.payload.data.data.id;
            let distributionItem = state.distributionList.items.find(i => i.data
                && (i.data.target.id === queryId));

            // If the query that was updated affects an distribution, remove
            // the stats to indicate that they were invalidated
            if (distributionItem) {
                return Object.assign({}, state, {
                    distributionList: updateOrAddListItem(state.distributionList,
                        distributionItem.data.id, {
                            statsItem: null,
                            target: action.payload.data.data,
                        }),
                });
            }
        }

        default:
            return state || {
                distributionList: createList(),
            };
    }
};
