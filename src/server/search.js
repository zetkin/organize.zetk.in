import searchMatches from '../utils/searchMatches';

// Include Date locales for search
require('sugar-date/locales/sv');
require('sugar-date/locales/da');


function search(ws, req) {
    let cache = new SearchCache();
    let queue;

    ws.on('message', function(json) {
        let msg = JSON.parse(json);

        let writeFunc = function(query, type, data) {
            ws.send(JSON.stringify({
                cmd: 'match',
                query: query,
                match: {
                    type: type,
                    data: data
                }
            }));
        };

        if (queue) {
            queue.abort();
        }

        var searchFuncs = [];

        if (!msg.scope || msg.scope == 'people') {
            searchFuncs.push(new SearchPersonQueryProc(msg.query, req.z, msg.org, cache, msg.lang));
            searchFuncs.push(new SearchPersonProc(msg.query, req.z, msg.org, cache, msg.lang));
        }

        if (!msg.scope || msg.scope == 'maps') {
            searchFuncs.push(new SearchLocationProc(msg.query, req.z, msg.org, cache, msg.lang));
        }

        if (!msg.scope || msg.scope == 'campaign') {
            searchFuncs.push(new SearchActionDayProc(msg.query, req.z, msg.org, cache, msg.lang));
            searchFuncs.push(new SearchCampaignProc(msg.query, req.z, msg.org, cache, msg.lang));
        }

        if (!msg.scope || msg.scope == 'dialog') {
            searchFuncs.push(new SearchCallAssignmentProc(msg.query, req.z, msg.org, cache, msg.lang));
        }

        if (!msg.scope || msg.scope == 'survey') {
            searchFuncs.push(new SearchSurveyProc(msg.query, req.z, msg.org, cache, msg.lang));
            searchFuncs.push(new SearchSurveySubmissionProc(msg.query, req.z, msg.org, cache, msg.lang));
        }

        queue = new SearchQueue(req.z, msg.org, msg.query, writeFunc, searchFuncs, msg.lang);
        queue.onComplete = (query) => {
            ws.send(JSON.stringify({
                cmd: 'complete',
                query: query,
            }));
        };

        queue.run();
    });
}


function searchProcFactory(type, opts) {
    function SearchProc(qs, z, orgId, cache, lang) {
        let _aborted = false;

        if (!opts.matcher) {
            opts.matcher = () => true;
        }

        let promise = null;
        if (opts.cache) {
            promise = cache.get(opts.cache);
        }

        if (!promise) {
            promise = opts.loader(z, orgId, qs, lang);

            if (opts.cache) {
                promise = cache.load(opts.cache, promise);
            }
        }

        this.abort = () => {
            _aborted = true;
        };

        this.run = (writeMatch) => {
            return promise
                .then(result => {
                    return new Promise(resolve => {
                        let idx = 0;

                        let matchNextBatch = () => {
                            let batchEnd = Math.min(result.length, idx + 10);

                            if (_aborted) {
                                resolve();
                                return;
                            }

                            while (idx < batchEnd) {
                                let obj = result[idx];
                                if (!opts.matcher || opts.matcher(qs, obj)) {
                                    writeMatch(qs, type, obj);
                                }

                                idx++;
                            }

                            if (batchEnd < result.length) {
                                setImmediate(matchNextBatch);
                            }
                            else {
                                resolve();
                            }
                        };

                        matchNextBatch();
                    });
                });
        }
    }

    return SearchProc;
}


function SearchCache() {
    let _cache = {};

    this.get = id => {
        if (id in _cache) {
            let val = _cache[id];
            return (val instanceof Promise)? val : Promise.resolve(val);
        }
    };

    this.load = (id, promise) => {
        _cache[id] = promise;
        return promise;
    };
}


function SearchQueue(z, orgId, query, writeMatch, searchFuncs, lang) {
    const MAX_MATCH_COUNT = 20;

    let _curFunc = null;
    let _aborted = true;
    let _matchCount = 0;
    let _writeMatch = (query, type, data) => {
        if (_matchCount < MAX_MATCH_COUNT) {
            writeMatch(query, type, data);
        }

        _matchCount++;
    };

    let _idx = 0;
    let _proceed = () => {
        if (_idx < searchFuncs.length && _matchCount < MAX_MATCH_COUNT) {
            _curFunc = searchFuncs[_idx++];

            let promise = _curFunc.run(_writeMatch);

            if (promise) {
                promise.then(function() {
                        _proceed();
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
            else {
                _proceed();
            }
        }
        else {
            // Done!
            this.onComplete(query);
        }
    };

    this.run = function() {
        _aborted = false;
        _proceed();
    }

    this.abort = function() {
        if (_curFunc) {
            _curFunc.abort();
            _curFunc = null;
        }

        _aborted = true;
        _idx = searchFuncs.length;
        _writeMatch = (query, type, data) => null;
    }
}


let SearchPersonProc = searchProcFactory('person', {
    cache: 'people',
    loader: (z, orgId) => {
        return z.resource('orgs', orgId, 'people')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj,
            [ 'first_name', 'last_name', 'email', 'phone' ]);
    },
});

let SearchPersonQueryProc = searchProcFactory('query', {
    cache: 'queries',
    loader: (z, orgId) => {
        return z.resource('orgs', orgId, 'people', 'queries')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj, [ 'title', 'info_text' ]);
    },
});

let SearchActionDayProc = searchProcFactory('actionday', {
    loader: (z, orgId, qs, lang) => {
        let date = Date.create(qs, lang);
        if (!date.isValid()) {
            return Promise.resolve([]);
        }

        let dateStr = date.format('{yyyy}-{MM}-{dd}');
        let endStr = date.addDays(1).format('{yyyy}-{MM}-{dd}');

        // Searching for date
        return z.resource('orgs', orgId, 'actions')
            .get(null, null, [['start_time', '>=', dateStr], ['end_time', '<', endStr]])
            .then(function(result) {
                let actions = result.data.data;

                if (actions.length > 0) {
                    const matchData = {
                        date: dateStr,
                        action_count: actions.length,
                    };

                    return [matchData]
                }
                else {
                    return [];
                }
            });
    },
});

let SearchCampaignProc = searchProcFactory('campaign', {
    cache: 'campaigns',
    loader: (z, orgId, qs, lang) => {
        return z.resource('orgs', orgId, 'campaigns')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj, [ 'title', 'info_text' ]);
    },
});

let SearchLocationProc = searchProcFactory('location', {
    cache: 'locations',
    loader: (z, orgId, qs, lang) => {
        return z.resource('orgs', orgId, 'locations')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj, [ 'title', 'info_text' ]);
    },
});

let SearchCallAssignmentProc = searchProcFactory('call_assignment', {
    cache: 'call_assignments',
    loader: (z, orgId, qs, lang) => {
        return z.resource('orgs', orgId, 'call_assignments')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj, [ 'title', 'description' ]);
    },
});

let SearchSurveyProc = searchProcFactory('survey', {
    cache: 'surveys',
    loader: (z, orgId, qs, lang) => {
        return z.resource('orgs', orgId, 'surveys')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return searchMatches(qs, obj, [ 'title', 'info_text' ]);
    },
});

let SearchSurveySubmissionProc = searchProcFactory('survey_submission', {
    cache: 'survey_submissions',
    loader: (z, orgId, qs, lang) => {
        return z.resource('orgs', orgId, 'survey_submissions')
            .get()
            .then(result => result.data.data);
    },
    matcher: (qs, obj) => {
        return (obj.respondent && searchMatches(qs, obj.respondent,
            [ 'first_name', 'last_name', 'email' ]));
    },
});

export default search;
