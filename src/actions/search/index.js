import * as types from '..';
import * as procs from './procs';
import { SearchQueue } from './utils';


let queue;

export function search(query) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;
        const scope = getState().search.scope;
        const lang = getState().intl.locale;

        if (queue) {
            queue.abort();
        }

        queue = new SearchQueue(z, orgId, query, lang);

        if (!scope || scope == 'campaign') {
            queue.addProc(new procs.ActionDaySearchProc(dispatch));
            queue.addProc(new procs.CampaignSearchProc(dispatch));
            queue.addProc(new procs.ActivitySearchProc(dispatch));
        }

        if (!scope || scope == 'dialog') {
            queue.addProc(new procs.CallAssignmentSearchProc(dispatch));
        }

        if (!scope || scope == 'people') {
            queue.addProc(new procs.PersonQuerySearchProc(dispatch));
            queue.addProc(new procs.PersonSearchProc(dispatch));
        }

        if (!scope || scope == 'maps') {
            queue.addProc(new procs.LocationSearchProc(dispatch));
        }

        if (!scope || scope == 'survey') {
            queue.addProc(new procs.SurveySearchProc(dispatch));
            queue.addProc(new procs.SurveySubmissionSearchProc(dispatch));
        }

        dispatch({
            type: types.SEARCH,
            meta: { query },
            payload: {
                promise: queue.run(),
            },
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
        payload: match,
    }
}

export function changeSearchScope(scope) {
    return {
        type: types.CHANGE_SEARCH_SCOPE,
        payload: { scope },
    };
}

export function resetSearchQuery() {
    return {
        type: types.RESET_SEARCH_QUERY,
    }
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
