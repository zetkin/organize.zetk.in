import { searchMatchFound } from '.';


export function searchProcFactory(type, opts = {}) {
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

export function SearchQueue(orgId, query, lang) {
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
