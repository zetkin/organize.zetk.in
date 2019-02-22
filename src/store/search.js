import * as types from '../actions';


export default function search(state = null, action) {
    const CLEAR_ACTIONS = [
        types.OPEN_PANE,
        types.PUSH_PANE,
        types.GOTO_SECTION,
        types.CLEAR_SEARCH,
    ];

    if (action.type == types.SEARCH + '_PENDING') {
        return Object.assign({}, state, {
            top: Object.assign({}, state.top, {
                results: [],
                query: action.meta.query,
                isActive: true,
                isPending: true,
            })
        });
    }
    else if (action.type == types.SEARCH + '_FULFILLED') {
        if (action.meta.query == state.query) {
            return Object.assign({}, state, {
                top: Object.assign({}, state.top, {
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
            top: Object.assign({}, state.top, {
                scope: action.payload.scope || state.scope,
                isActive: true,
            })
        });
    }
    else if (action.type == types.SEARCH_MATCH_FOUND) {
        if (action.payload.query == state.top.query) {
            return Object.assign({}, state, {
                top: Object.assign({}, state.top, {
                    results: state.top.results.concat([ action.payload ]),
                })
            });
        }
        else {
            return state;
        }
    }
    else if (action.type == types.RESET_SEARCH_QUERY) {
        return Object.assign({}, state, {
            top: Object.assign({}, state.top, {
                results: [],
                query: '',
            })
        });
    }
    else if (action.type == types.END_SEARCH) {
        return Object.assign({}, state, {
            top: Object.assign({}, state.top, {
                isActive: false,
            })
        });
    }
    else if (action.type == types.CHANGE_SEARCH_SCOPE) {
        return Object.assign({}, state, {
            top: Object.assign({}, state.top, {
                scope: action.payload.scope,
            })
        });
    }
    else if (CLEAR_ACTIONS.indexOf(action.type) >= 0) {
        return Object.assign({}, state, {
            top: Object.assign({}, state.top, {
                query: '',
                isActive: false,
                isPending: false,
                scope: null,
                results: []
            })
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
