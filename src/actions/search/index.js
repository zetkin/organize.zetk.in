import * as types from '..';
import * as procs from './procs';
import { SearchQueue } from './utils';


let queue;

export function search(field, query) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;
        const scope = getState().search[field].scope;
        const lang = getState().intl.locale;

        if (queue) {
            queue.abort();
        }

        if (query.length > 2) {
            queue = new SearchQueue(z, orgId, query, lang, field);

            if (!scope || scope.includes('action')) {
                queue.addProc(new procs.ActionDaySearchProc(dispatch));
            }

            if (!scope || scope.includes('personquery')) {
                queue.addProc(new procs.PersonQuerySearchProc(dispatch));
            }

            if (!scope || scope.includes('person')) {
                queue.addProc(new procs.PersonSearchProc(dispatch));
            }

            if (!scope || scope.includes('campaign')) {
                queue.addProc(new procs.CampaignSearchProc(dispatch));
            }

            if (!scope || scope.includes('activity')) {
                queue.addProc(new procs.ActivitySearchProc(dispatch));
            }

            if (!scope || scope.includes('callassignment')) {
                queue.addProc(new procs.CallAssignmentSearchProc(dispatch));
            }

            if (!scope || scope.includes('location')) {
                queue.addProc(new procs.LocationSearchProc(dispatch));
            }

            if (!scope || scope.includes('survey')) {
                queue.addProc(new procs.SurveySearchProc(dispatch));
            }

            if (!scope || scope.includes('surveysubmission')) {
                queue.addProc(new procs.SurveySubmissionSearchProc(dispatch));
            }
        }

        dispatch({
            type: types.SEARCH,
            meta: { query, field },
            payload: {
                promise: queue? queue.run() : Promise.resolve(),
            },
        });
    }
}

export function beginSearch(field, scope) {
    return {
        type: types.BEGIN_SEARCH,
        meta: { field },
        payload: { scope },
    };
}

export function searchMatchFound(field, match) {
    return {
        type: types.SEARCH_MATCH_FOUND,
        meta: { field },
        payload: match,
    }
}

export function changeSearchScope(field, scope) {
    return {
        type: types.CHANGE_SEARCH_SCOPE,
        meta: { field },
        payload: { scope },
    };
}

export function resetSearchQuery(field) {
    return {
        type: types.RESET_SEARCH_QUERY,
        meta: { field }
    }
}

export function endSearch(field) {
    return {
        type: types.END_SEARCH,
        meta: { field }
    };
}

export function clearSearch(field, scope) {
    return {
        type: types.CLEAR_SEARCH,
        meta: { field },
    };
}
