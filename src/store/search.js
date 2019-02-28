import * as types from '../actions';

export default function search(state = null, action) {
    const TOP_CLEAR_ACTIONS = [
        types.OPEN_PANE,
        types.PUSH_PANE,
        types.GOTO_SECTION,
    ];

    if (action.type == types.SEARCH + '_PENDING') {
        return Object.assign({}, state, {
            [action.meta.field]: Object.assign({}, state[action.meta.field], {
                results: [],
                query: action.meta.query,
                isActive: true,
                isPending: true,
            })
        });
    }
    else if (action.type == types.SEARCH + '_FULFILLED') {
        if (action.meta.query == state[action.meta.field].query) {
            return Object.assign({}, state, {
                [action.meta.field]: Object.assign({}, state[action.meta.field], {
                    isPending: false,
                })
            });
        }
        else {
            return state
        }
    }
    else if (action.type == types.BEGIN_SEARCH) {
        return Object.assign({}, state, {
            [action.meta.field]: Object.assign({}, state[action.meta.field], {
                scope: action.payload.scope || state[action.meta.field].scope,
                isActive: true,
                results: []
            })
        });
    }
    else if (action.type == types.SEARCH_MATCH_FOUND) {
        if (action.payload.query == state[action.meta.field].query) {
            return Object.assign({}, state, {
                [action.meta.field]: Object.assign({}, state[action.meta.field], {
                    results: state[action.meta.field].results.concat([ action.payload ]),
                })
            });
        }
        else {
            return state;
        }
    }
    else if (action.type == types.RESET_SEARCH_QUERY) {
        return Object.assign({}, state, {
            [action.meta.field]: Object.assign({}, state[action.meta.field], {
                results: [],
                query: '',
            })
        });
    }
    else if (action.type == types.END_SEARCH) {
        return Object.assign({}, state, {
            [action.meta.field]: Object.assign({}, state[action.meta.field], {
                isActive: false,
            })
        });
    }
    else if (action.type == types.CHANGE_SEARCH_SCOPE) {
        return Object.assign({}, state, {
            [action.meta.field]: Object.assign({}, state[action.meta.field], {
                scope: action.payload.scope,
            })
        });
    }
    else if (action.type == types.CLEAR_SEARCH) {
        const modified = Object.assign({}, state);
        delete modified[action.meta.field];
        if (action.meta.field == 'top') {
            modified.top = {
                query: '',
                isActive: false,
                isPending: false,
                scope: null,
                results: []
            };
        }

        return modified;
    }
    else if (TOP_CLEAR_ACTIONS.indexOf(action.type) >= 0) {
        return Object.assign({}, state, {
            top: {
                query: '',
                isActive: false,
                isPending: false,
                scope: null,
                results: []
            }
        });
    }
    else {
        return state || {
            top: {
                query: '',
                isActive: false,
                isPending: false,
                scope: null,
                results: [],
            }
        };
    }
}
