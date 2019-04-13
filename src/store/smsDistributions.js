import * as types from '../actions';
import {
    createList,
    createListItems,
    createListItem,
    updateOrAddListItem,
    updateOrAddListItems,
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

        case types.RETRIEVE_SMS_DISTRIBUTION_TARGETS + '_PENDING':
            return Object.assign({}, state, {
                targetsByDistribution: Object.assign({}, state.targetsByDistribution, {
                    [action.meta.id]: createList(null, { isPending: true }),
                }),
            });

        case types.RETRIEVE_SMS_DISTRIBUTION_TARGETS + '_FULFILLED':
            return Object.assign({}, state, {
                targetsByDistribution: Object.assign({}, state.targetsByDistribution, {
                    [action.meta.id]: updateOrAddListItems(state.targetsByDistribution[action.meta.id],
                        action.payload.data.data,
                        { isPending: false, error: null },
                    ),
                }),
            });

        case types.UPDATE_SMS_DISTRIBUTION + '_FULFILLED': {
            const distribution = {
                ...action.payload.data.data,
                statsItem: null,
            };

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(
                    state.distributionList,
                    distribution.id,
                    distribution,
                    { isPending: false, error: null },
                ),
            });
        }

        case types.UPDATE_QUERY + '_FULFILLED': {
            let queryId = action.payload.data.data.id;
            let distributionItem = state.distributionList.items.find(i => i.data
                && (i.data.target.id === queryId));

            if (distributionItem) {
                return Object.assign({}, state, {
                    distributionList: updateOrAddListItem(state.distributionList,
                        distributionItem.data.id, {
                            statsItem: null,
                            target: action.payload.data.data,
                        }),
                    targetsByDistribution: Object.assign({}, state.targetsByDistribution, {
                        [distributionItem.data.id]: null,
                    }),
                });
            }
        }

        default:
            return state || {
                distributionList: createList(),
                targetsByDistribution: {},
            };
    }
};
