import * as types from '.';
import searchMatches from '../utils/searchMatches';


export function search(query) {
    return ({ dispatch, getState }) => {
        execSearch(getState, dispatch, query);

        dispatch({
            type: types.SEARCH,
            payload: { query },
        });
    }
}

export function beginSearch(scope) {
    return {
        type: types.BEGIN_SEARCH,
        payload: { scope },
    };
}

export function searchMatchFound(match) {
    return {
        type: types.SEARCH_MATCH_FOUND,
        payload: { match },
    }
}

export function searchPending() {
    return {
        type: types.SEARCH_PENDING,
    };
}

export function searchComplete() {
    return {
        type: types.SEARCH_COMPLETE,
    };
}

export function changeSearchScope(scope) {
    return {
        type: types.CHANGE_SEARCH_SCOPE,
        payload: { scope },
    };
}

export function endSearch() {
    return {
        type: types.END_SEARCH,
    };
}

export function clearSearch(scope) {
    return {
        type: types.CLEAR_SEARCH,
    };
}


let ws = null;
let wsOpen = false;

function execSearch(getState, dispatch, query) {
    let orgId = getState().org.activeId;
    let scope = getState().search.scope;
    let lang = getState().intl.locale;

    let sendQuery = function(query) {
        // Don't search for really short query strings
        if (query.length >= 3) {
            dispatch(searchPending());

            ws.send(JSON.stringify({
                'cmd': 'search',
                'scope': scope,
                'lang': lang,
                'org': orgId,
                'query': query
            }));
        }
    };

    if (!wsOpen) {
        let protocol = (window.location.protocol == 'https:')? 'wss' : 'ws';
        let url = protocol + '://' + window.location.host + '/search';

        ws = new WebSocket(url);
        ws.onopen = function() {
            wsOpen = true;
            sendQuery(query);
        };
        ws.onerror = function() {
            dispatch(searchComplete());
            wsOpen = false;
        };
        ws.onclose = function() {
            dispatch(searchComplete());
            wsOpen = false;
        };


        ws.onmessage = function(ev) {
            let msg = JSON.parse(ev.data);
            let currentQuery = getState().search.query;

            if (msg.cmd == 'match' && msg.query == currentQuery) {
                var existing = getState().search.results.find(
                    m => (m.type == msg.match.type
                            && m.data.id == msg.match.data.id));

                if (existing === undefined) {
                    dispatch(searchMatchFound(msg.match));
                }
            }
            else if (msg.cmd == 'complete' && msg.query == currentQuery) {
                dispatch(searchComplete());
            }
        };
    }
    else {
        sendQuery(query);
    }
}
