import * as types from '../actions';

import {
    createList,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
    updateOrIgnoreListItem,
    updateOrAddListItems,
} from '../utils/store';


/*
 * If there exists both a list of query matches, and a list of view rows
 * (i.e. people that have been statically saved in the view), this function can
 * be used to flag any rows in the list of query matches as saved if they also
 * exist in the static list.
*/
function flagListItemsIfSaved(matchList, savedList) {
    let changed = false;

    if (savedList && savedList.items) {
        const outList = Object.assign({}, matchList, {
            items: matchList.items.map(matchItem => {
                if (!!savedList.items.find(savedItem => savedItem.data.id == matchItem.data.id)) {
                    if (!matchItem.data.saved) {
                        changed = true;
                        return Object.assign({}, matchItem, {
                            data: Object.assign({}, matchItem.data, { saved: true }),
                        });
                    }
                }
                else if (matchItem.data.saved) {
                    // Was saved, is not anymore
                    changed = true;
                    return Object.assign({}, matchItem, {
                        data: Object.assign({}, matchItem.data, { saved: false }),
                    });
                }

                // Return unchanged if reached
                return matchItem;
            }),
        });

        // Return copy if changed or original if unchanged
        return changed? outList : matchList;
    }
    else {
        // No saved list exists, return unchanged
        return matchList;
    }
}


export default function personViews(state = null, action) {
    if (action.type == types.RETRIEVE_PERSON_VIEWS + '_FULFILLED') {
        return Object.assign({}, state, {
            viewList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEWS + '_PENDING') {
        return Object.assign({}, state, {
            viewList: Object.assign({}, state.viewList, { isPending: true }),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW + '_FULFILLED') {
        const view = action.payload.data.data;
        return Object.assign({}, state, {
            viewList: updateOrAddListItem(state.viewList, view.id, view),
            matchesByViewAndQuery: Object.assign({}, state.matchesByViewAndQuery, {
                [view.id]: {},
            }),
        });
    }
    else if (action.type == types.UPDATE_PERSON_VIEW + '_FULFILLED') {
        const view = action.payload.data.data;
        return Object.assign({}, state, {
            viewList: updateOrAddListItem(state.viewList, view.id, view),
        });
    }
    else if (action.type == types.REORDER_PERSON_VIEW_COLUMNS + '_FULFILLED') {
        const viewId = action.meta.viewId;
        const oldColList = state.columnsByView[viewId];
        const newColList = {
            ...oldColList,
            // Updating the column order will trigger the view to re-fetch rows
            items: action.payload.data.data.order.map(id => getListItemById(oldColList, id)),
        };

        return Object.assign({}, state, {
            columnsByView: {
                ...state.columnsByView,
                [viewId]: newColList,
            },
            rowsByView: {
                ...state.rowsByView,
                [viewId]: null,
            },
            matchesByViewAndQuery: {
                ...state.matchesByViewAndQuery,
                [viewId]: {},
            },
        })
    }
    else if (action.type == types.DELETE_PERSON_VIEW + '_FULFILLED') {
        const viewId = action.meta.viewId;
        return Object.assign({}, state, {
            viewList: removeListItem(state.viewList, viewId),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_COLUMNS + '_FULFILLED') {
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [action.meta.viewId]: createList(action.payload.data.data),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_COLUMNS + '_PENDING') {
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [action.meta.viewId]: createList(null, { isPending: true }),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROWS + '_FULFILLED') {
        const rows = action.payload.data.data
            .map(row => Object.assign(row, { saved: true }));

        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [action.meta.viewId]: createList(rows),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROWS + '_PENDING') {
        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [action.meta.viewId]: createList(null, { isPending: true }),
            })
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROW + '_FULFILLED') {
        const viewId = action.meta.viewId;
        const row = action.payload.data.data

        const newState = Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: updateOrIgnoreListItem(state.rowsByView[viewId], row.id, row),
            })
        });

        // Also update any occurances of row in view-queries
        if (state.matchesByViewAndQuery[viewId]) {
            const affectedQueries = {};
            Object.keys(state.matchesByViewAndQuery[viewId]).forEach(queryId => {
                const oldList = state.matchesByViewAndQuery[viewId][queryId];
                const newList = updateOrIgnoreListItem(oldList, row.id, row);

                if (newList != oldList) {
                    affectedQueries[queryId] = newList;
                }
            });

            if (Object.keys(affectedQueries).length) {
                newState.matchesByViewAndQuery = Object.assign({}, state.matchesByViewAndQuery, {
                    [viewId]: Object.assign({}, state.matchesByViewAndQuery[viewId], affectedQueries),
                });
            }
        }

        return newState;
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_ROW + '_PENDING') {
        const viewId = action.meta.viewId;
        const personId = action.meta.personId;

        const newState = Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: updateOrIgnoreListItem(state.rowsByView[viewId], personId, { dirty: false }),
            })
        });

        // Also remove dirty flag from any rows in view query matches
        if (state.matchesByViewAndQuery[viewId]) {
            const affectedQueries = {};
            Object.keys(state.matchesByViewAndQuery[viewId]).forEach(queryId => {
                const oldList = state.matchesByViewAndQuery[viewId][queryId];
                const newList = updateOrIgnoreListItem(oldList, personId, { dirty: false });

                if (newList != oldList) {
                    affectedQueries[queryId] = newList;
                }
            });

            if (Object.keys(affectedQueries).length) {
                newState.matchesByViewAndQuery = Object.assign({}, state.matchesByViewAndQuery, {
                    [viewId]: Object.assign({}, state.matchesByViewAndQuery[viewId], affectedQueries),
                });
            }
        }

        return newState;
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_QUERY + '_FULFILLED') {
        const queryId = action.meta.queryId;
        const viewId = action.meta.viewId;

        const newState = Object.assign({}, state, {
            matchesByViewAndQuery: Object.assign({}, state.matchesByViewAndQuery, {
                [viewId]: Object.assign({}, state.matchesByViewAndQuery[viewId], {
                    [queryId]: createList(action.payload.data.data),
                }),
            }),
        });

        newState.matchesByViewAndQuery[viewId][queryId] =
            flagListItemsIfSaved(newState.matchesByViewAndQuery[viewId][queryId], state.rowsByView[viewId]);

        return newState;
    }
    else if (action.type == types.RETRIEVE_PERSON_VIEW_QUERY + '_PENDING') {
        const queryId = action.meta.queryId;
        const viewId = action.meta.viewId;

        return Object.assign({}, state, {
            matchesByViewAndQuery: Object.assign({}, state.matchesByViewAndQuery, {
                [viewId]: Object.assign({}, state.matchesByViewAndQuery[viewId], {
                    [queryId]: createList(null, { isPending: true }),
                }),
            }),
        });
    }
    else if (action.type == types.ADD_PERSON_VIEW_ROW + '_FULFILLED') {
        const viewId = action.meta.viewId;

        // Flag row as saved
        const row = action.payload.data.data;
        row.saved = true;

        const newState = Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: Object.assign({},
                    updateOrAddListItem(state.rowsByView[viewId], row.id, row),
                    { addIsPending: false },
                ),
            })
        });

        // If query matches have been retrieved for this view, go over and
        // flag them anew, to reflect that a new person has been "saved"
        if (state.matchesByViewAndQuery[viewId]) {
            newState.matchesByViewAndQuery[viewId] = Object.assign({}, state.matchesByViewAndQuery[viewId]);

            Object.keys(newState.matchesByViewAndQuery[viewId]).forEach(queryId => {
                newState.matchesByViewAndQuery[viewId][queryId] =
                    flagListItemsIfSaved(newState.matchesByViewAndQuery[viewId][queryId], newState.rowsByView[viewId]);
            });
        }

        return newState;
    }
    else if (action.type == types.ADD_PERSON_VIEW_ROW + '_PENDING') {
        const viewId = action.meta.viewId;
        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: Object.assign({}, state.rowsByView[viewId], {
                    addIsPending: true,
                }),
            })
        });
    }
    else if (action.type == types.ADD_PERSON_VIEW_ROW + '_REJECTED') {
        const viewId = action.meta.viewId;
        return Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: Object.assign({}, state.rowsByView[viewId], {
                    addIsPending: false,
                }),
            })
        });
    }
    else if (action.type == types.REMOVE_PERSON_VIEW_ROW + '_FULFILLED') {
        const viewId = action.meta.viewId;
        const personId = action.meta.personId;

        const newState = Object.assign({}, state, {
            rowsByView: Object.assign({}, state.rowsByView, {
                [viewId]: removeListItem(state.rowsByView[viewId], personId),
            })
        });

        // If query matches have been retrieved for this view, go over and
        // flag them anew, to reflect that a new person has been "saved"
        if (state.matchesByViewAndQuery[viewId]) {
            newState.matchesByViewAndQuery[viewId] = Object.assign({}, state.matchesByViewAndQuery[viewId]);

            Object.keys(newState.matchesByViewAndQuery[viewId]).forEach(queryId => {
                newState.matchesByViewAndQuery[viewId][queryId] =
                    flagListItemsIfSaved(newState.matchesByViewAndQuery[viewId][queryId], newState.rowsByView[viewId]);
            });
        }

        return newState;
    }
    else if (action.type == types.CREATE_PERSON_VIEW_COLUMN + '_FULFILLED') {
        const viewId = action.meta.viewId;
        const column = action.payload.data.data;
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [viewId]: updateOrAddListItem(state.columnsByView[viewId], column.id, column),
            })
        });
    }
    else if (action.type == types.UPDATE_PERSON_VIEW_COLUMN + '_FULFILLED') {
        const viewId = action.meta.viewId;
        const column = action.payload.data.data;
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [viewId]: updateOrAddListItem(state.columnsByView[viewId], column.id, column),
            })
        });
    }
    else if (action.type == types.REMOVE_PERSON_VIEW_COLUMN + '_FULFILLED') {
        const { viewId, columnId } = action.meta;
        return Object.assign({}, state, {
            columnsByView: Object.assign({}, state.columnsByView, {
                [viewId]: removeListItem(state.columnsByView[viewId], columnId),
            })
        });
    }
    else {
        // Not a view related action, but it could still be an action that
        // affects data in a view, and should flag a row as dirty. Check
        // for action types which should have this affect, and create a list
        // of dirtyPersonIds in dirty views.
        const dirtyPersonIds = [];
        const affectedViewIds = [];

        if (action.type == types.CREATE_PERSON_NOTE + '_FULFILLED') {
            dirtyPersonIds.push(action.meta.id);

            Object.keys(state.columnsByView)
                .filter(viewId => {
                    const columnList = state.columnsByView[viewId];
                    return columnList.items && columnList.items.some(item => {
                        return (item.data && item.data.type == 'person_notes');
                    });
                })
                .forEach(viewId => {
                    // Add any affected views to list
                    affectedViewIds.push(viewId)
                });
        }
        else if (action.type == types.ADD_TAGS_TO_PERSON + '_FULFILLED') {
            dirtyPersonIds.push(action.meta.id);

            Object.keys(state.columnsByView)
                .filter(viewId => {
                    const columnList = state.columnsByView[viewId];
                    if (columnList.items) {
                        return columnList.items.some(item => {
                            if (item.data && item.data.type == 'person_query') {
                                // Always return true for query columns, becuse there
                                // is little way of knowing what might affect it
                                return true;
                            }

                            if (item.data && item.data.type == 'person_tag') {
                                // Return true if the tag_id for this column is one
                                // of the tags that were added by the action
                                return action.meta.tagIds.includes(item.data.config.tag_id);
                            }
                        });
                    }

                    return false;
                })
                .forEach(viewId => {
                    // Add any affected views to list
                    affectedViewIds.push(viewId)
                });
        }
        else if (action.type == types.REMOVE_TAG_FROM_PERSON + '_FULFILLED') {
            dirtyPersonIds.push(action.meta.id);

            Object.keys(state.columnsByView)
                .filter(viewId => {
                    const columnList = state.columnsByView[viewId];
                    if (columnList.items) {
                        return columnList.items.some(item => {
                            if (item.data && item.data.type == 'person_query') {
                                // Always return true for query columns, becuse there
                                // is little way of knowing what might affect it
                                return true;
                            }

                            if (item.data && item.data.type == 'person_tag') {
                                // Return true if the tag_id for this column is one
                                // of the tags that were added by the action
                                return action.meta.tagId == item.data.config.tag_id;
                            }
                        });
                    }

                    return false;
                })
                .forEach(viewId => {
                    // Add any affected views to list
                    affectedViewIds.push(viewId)
                });
        }

        // Were any people in any views affected? Then and only then should
        // we copy the state (immutable) and start flagging.
        if (dirtyPersonIds.length && affectedViewIds.length) {
            const newState = Object.assign({}, state, {
                rowsByView: Object.assign({}, state.rowsByView),
            });

            affectedViewIds.forEach(viewId => {
                dirtyPersonIds.forEach(personId => {
                    // Flag row as dirty if it exists
                    newState.rowsByView[viewId] = updateOrIgnoreListItem(newState.rowsByView[viewId], personId, { dirty: true });

                    // Have any queries been retrieved through this view?
                    if (newState.matchesByViewAndQuery[viewId]) {
                        const flaggedQueries = {};

                        // Look for view-query rows that were affected and flag them, while
                        // keeping track of which queries were affected.
                        Object.keys(newState.matchesByViewAndQuery[viewId]).forEach(queryId => {
                            const oldList = newState.matchesByViewAndQuery[viewId][queryId];
                            const newList = updateOrIgnoreListItem(oldList, personId, { dirty: true });

                            if (oldList != newList) {
                                flaggedQueries[queryId] = newList;
                            }
                        });

                        // Only copy matchesByViewAndQuery if there were actually any updates
                        if (Object.keys(flaggedQueries).length) {
                            newState.matchesByViewAndQuery = Object.assign({}, newState.matchesByViewAndQuery, {
                                [viewId]: Object.assign({}, newState.matchesByViewAndQuery[viewId], flaggedQueries),
                            });
                        }
                    }
                });
            });

            return newState;
        }
        else {
            return state || {
                viewList: createList(),
                columnsByView: {},
                matchesByViewAndQuery: {},
                rowsByView: {},
            };
        }
    }
}
