import { searchMatchFound } from '.';


export function searchProcFactory(type, opts = {}) {
    function SearchProc(dispatch) {
        let _aborted = false;

        if (!opts.loader) {
            opts.loader = (z, orgId, q) => {
                return z.resource('orgs', orgId, 'search', type)
                    .post({ q })
                    .then(result => result.data.data);
            }
        }

        const _submitMatch = (query, data) => {
            if (!_aborted) {
                dispatch(searchMatchFound({ type, query, data }));
            }
        }

        this.run = (z, orgId, query, lang) => {
            return opts.loader(z, orgId, query, lang)
                .then(result => {
                    result.forEach(match => {
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

export function SearchQueue(z, orgId, query, lang) {
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
                return proc.run(z, orgId, query, lang)
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
