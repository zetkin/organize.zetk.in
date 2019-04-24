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

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDITS + '_PENDING':
            return Object.assign({}, state, {
                creditsItem: createListItem({}, { isPending: true }),
            });

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDITS + '_FULFILLED':
            return Object.assign({}, state, {
                creditsItem: createListItem(action.payload.data.data),
            });

        case types.BEGIN_SMS_DISTRIBUTION_CREDIT_PURCHASE:
            return Object.assign({}, state, {
                purchases: Object.assign({}, state.purchases, {
                    [action.meta.id]: {
                        isPending: false,
                        error: null,
                        data: null,
                    },
                }),
            });

        case types.COMPLETE_SMS_DISTRIBUTION_CREDIT_PURCHASE + '_PENDING':
            return Object.assign({}, state, {
                purchases: Object.assign({}, state.purchases, {
                    [action.meta.id]: {
                        isPending: true,
                        error: null,
                        data: null,
                    },
                }),
            });
        case types.COMPLETE_SMS_DISTRIBUTION_CREDIT_PURCHASE + '_REJECTED':
            return Object.assign({}, state, {
                purchases: Object.assign({}, state.purchases, {
                    [action.meta.id]: {
                        isPending: false,
                        error: action.payload,
                        data: null,
                    },
                }),
            });

        case types.COMPLETE_SMS_DISTRIBUTION_CREDIT_PURCHASE + '_FULFILLED':
            return Object.assign({}, state, {
                purchases: Object.assign({}, state.purchases, {
                    [action.meta.id]: {
                        isPending: false,
                        error: null,
                        data: action.payload.data.data,
                    },
                }),
            });

        case types.END_SMS_DISTRIBUTION_CREDIT_PURCHASE:
            return Object.assign({}, state, {
                purchases: Object.assign({}, state.purchases, {
                    [action.meta.id]: null,
                }),
            });

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDIT_TRANSACTIONS + '_PENDING':
            return Object.assign({}, state, {
                transactionList: Object.assign({}, state.transactionList, {
                    isPending: true,
                    error: null,
                }),
            });

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDIT_TRANSACTIONS + '_FULFILLED': {
            let data = action.payload.data.data;

            data.concat().sort((a, b) => a.created < b.created ? -1 : 1);

            let balance = 0;

            data = data.map(transaction => {
                balance += transaction.amount;

                return {
                    ...transaction,
                    balance
                };
            });

            data.reverse();

            return Object.assign({}, state, {
                transactionList: {
                    isPending: false,
                    error: null,
                    items: createListItems(data),
                },
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDIT_TRANSACTION + '_PENDING': {
            const transaction = { id: action.meta.id };

            return Object.assign({}, state, {
                transactionList: updateOrAddListItem(state.transactionList,
                    transaction.id, transaction, { isPending: true })
            });
        }

        case types.RETRIEVE_SMS_DISTRIBUTION_CREDIT_TRANSACTION + '_FULFILLED': {
            const transaction = action.payload.data.data;

            return Object.assign({}, state, {
                transactionList: updateOrAddListItem(state.transactionList,
                    transaction.id, transaction, { isPending: false })
            });
        }

        default:
            return state || {
                distributionList: createList(),
                targetsByDistribution: {},
                messagesByDistribution: {},
                creditsItem: null,
                purchases: {},
                transactionList: createList(),
            };
    }
};
