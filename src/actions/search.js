import * as types from '.';


let queue;

export function search(query) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;
        const scope = getState().search.scope;
        const lang = getState().intl.locale;

        if (queue) {
            queue.abort();
        }

        queue = new SearchQueue(orgId, query, lang);

        if (!scope || scope == 'people') {
            queue.addProc(new PersonQuerySearchProc(z, dispatch));
            queue.addProc(new PersonSearchProc(z, dispatch));
        }

        if (!scope || scope == 'survey') {
            queue.addProc(new SurveySubmissionSearchProc(z, dispatch));
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


const PersonSearchProc = searchProcFactory('person');
const PersonQuerySearchProc = searchProcFactory('personquery');
const SurveySubmissionSearchProc = searchProcFactory('surveysubmission');


function searchProcFactory(type, opts = {}) {
    function SearchProc(z, dispatch) {
        let _aborted = false;

        if (!opts.loader) {
            opts.loader = (orgId, q) => {
                return z.resource('orgs', orgId, 'search', type)
                    .post({ q });
            }
        }

        const _submitMatch = (query, data) => {
            if (!_aborted) {
                dispatch(searchMatchFound({ type, query, data }));
            }
        }

        this.run = (orgId, query, lang) => {
            return opts.loader(orgId, query, lang)
                .then(result => {
                    result.data.data.forEach(match => {
                        _submitMatch(query, match)
                    });
                });
        }

        this.abort = () => {
            _aborted = true;
        }
    }

    return SearchProc;
}

function SearchQueue(orgId, query, lang) {
    let _curProc = null;
    let _aborted = true;
    let _searchProcs = [];

    this.addProc = proc => {
        _searchProcs.push(proc);
    }

    this.run = () => {
        _aborted = false;

        let promise = Promise.resolve();
        _searchProcs.forEach(proc => {
            promise = promise.then(() => {
                if (_aborted) {
                    return null;
                }

                _curProc = proc;
                return proc.run(orgId, query, lang)
                    .catch(err => {
                        console.log('Error while searching', err);
                        // Ignore and proceed
                        return true;
                    });
            })
        });

        return promise;
    }

    this.abort = () => {
        if (_curProc) {
            _curProc.abort();
            _curProc = null;
        }

        _aborted = true;
    }
}
