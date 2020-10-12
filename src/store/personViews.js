import * as types from '../actions';

import {
    createList,
    removeListItem,
    updateOrAddListItem,
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
    else {
        return state || {
            viewList: createList(),
            columnsByView: {},
            matchesByViewAndQuery: {},
            rowsByView: {},
        };
    }
}
