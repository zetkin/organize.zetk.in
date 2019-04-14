import * as types from '../actions';
import {
    createList,
    createListItems,
    createListItem,
    getListItemById,
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
            const distributionId = action.meta.id;

            const distribution = getListItemById(
                state.distributionList,
                distributionId,
            );

            const statsData = distribution && distribution.data &&
                distribution.data.statsItem && distribution.data.statsItem.data;

            const newStatsItem = createListItem(statsData, {
                isPending: true,
            });

            return Object.assign({}, state, {
                distributionList: updateOrAddListItem(
                    state.distributionList,
                    distributionId,
                    {
                        id: distributionId,
                        statsItem: newStatsItem,
                    },
                ),
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

        case types.RETRIEVE_SMS_DISTRIBUTION_MESSAGES + '_PENDING': {
            const distributionId = action.meta.id;

            const messages = state.messagesByDistribution[distributionId];

            return Object.assign({}, state, {
                messagesByDistribution: Object.assign({}, state.messagesByDistribution, {
                    [action.meta.id]: Object.assign({}, messages, { isPending: true }),
                }),
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION_MESSAGES + '_FULFILLED': {
            const messages = action.payload.data.data;

            return Object.assign({}, state, {
                messagesByDistribution: Object.assign({}, state.messagesByDistribution, {
                    [action.meta.id]: createList(messages, { isPending: false })
                }),
            });
        }

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
                messagesByDistribution: {},
            };
    }
};