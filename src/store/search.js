import * as types from '../actions';
import searchMatches from '../utils/searchMatches';


export default function search(state = null, action) {
    switch (action.type) {
        case types.SEARCH:
            return Object.assign({}, state, {
                query: action.payload.query,
                isActive: true,

                // Filter existing results against new query, or if the query
                // is shorter than three characters, clear the results
                results: action.payload.query.length < 3? [] : 
                    state.results.filter(
                        r => searchMatches(action.payload.query, r.data))
            });

        case types.BEGIN_SEARCH:
            return Object.assign({}, state, {
                scope: action.payload.scope || state.scope,
                isActive: true,
            });

        case types.SEARCH_MATCH_FOUND:
            return Object.assign({}, state, {
                results: state.results.concat([ action.payload.match ]),
            });

        case types.END_SEARCH:
            return Object.assign({}, state, {
                isActive: false,
            });

        case types.OPEN_PANE:
        case types.PUSH_PANE:
        case types.GOTO_SECTION:
        case types.CLEAR_SEARCH:
            return Object.assign({}, state, {
                query: '',
                isActive: false,
                scope: null,
                results: []
            });

        case types.CHANGE_SEARCH_SCOPE:
            return Object.assign({}, state, {
                scope: action.payload.scope,
            });

        default:
            return state || {
                query: '',
                isActive: false,
                scope: null,
                results: [],
            };
    }
}
