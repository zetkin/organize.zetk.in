import searchMatches from '../utils/searchMatches';

// Include Date locales for search
require('sugar-date/locales/sv');
require('sugar-date/locales/da');


function search(ws, req) {
    var queue;

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
            searchFuncs.push(searchPeople);
            searchFuncs.push(searchPersonQueries);
        }

        if (!msg.scope || msg.scope == 'maps') {
            searchFuncs.push(searchLocations);
        }

        if (!msg.scope || msg.scope == 'campaign') {
            searchFuncs.push(searchActions);
            searchFuncs.push(searchCampaigns);
        }

        if (!msg.scope || msg.scope == 'dialog') {
            searchFuncs.push(searchCallAssignments);
        }

        if (!msg.scope || msg.scope == 'survey') {
            searchFuncs.push(searchSurveys);
            searchFuncs.push(searchSurveySubmissions);
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

function SearchQueue(z, orgId, query, writeMatch, searchFuncs, lang) {
    const MAX_MATCH_COUNT = 20;

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
            const searchFunc = searchFuncs[_idx++];
            const promise = searchFunc(z, orgId, query, _writeMatch, lang)

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
        _proceed();
    }

    this.abort = function() {
        _idx = searchFuncs.length;
        _writeMatch = (query, type, data) => null;
    }
}

function searchActions(z, orgId, q, writeMatch, lang) {
    var date = Date.create(q, lang);
    if (date.isValid()) {
        const dateStr = date.format('{yyyy}-{MM}-{dd}');
        const endStr = date.addDays(1).format('{yyyy}-{MM}-{dd}');

        // Searching for date
        // TODO: Search using backend filtering
        return z.resource('orgs', orgId, 'actions')
            .get(null, null, [['start_time', '>=', dateStr], ['end_time', '<', endStr]])
            .then(function(result) {
                const actions = result.data.data;

                if (actions.length > 0) {
                    const matchData = {
                        date: dateStr,
                        action_count: actions.length,
                    };

                    writeMatch(q, 'actionday', matchData);
                }
            });
    }
    else {
        // TODO: Implement searching for actions based on loc/activity
        return null;
    }
}

function searchPeople(z, orgId, q, writeMatch) {
    // TODO: Use API-side filtering once implemented
    return z.resource('orgs', orgId, 'people').get()
        .then(function(result) {
            var i;
            var people = result.data.data;

            for (i = 0; i < people.length; i++) {
                var p = people[i];
                if (searchMatches(q, p)) {
                    writeMatch(q, 'person', p);
                }
            }
        })
}

function searchPersonQueries(z, orgId, q, writeMatch) {
    return z.resource('orgs', orgId, 'people', 'queries').get()
        .then(function(result) {
            let queries = result.data.data;

            for (let i = 0; i < queries.length; i++) {
                if (searchMatches(q, queries[i])) {
                    writeMatch(q, 'query', queries[i]);
                }
            }
        });
}

function searchLocations(z, orgId, q, writeMatch) {
    return z.resource('orgs', orgId, 'locations').get()
        .then(function(result) {
            var i;
            var locations = result.data.data;

            for (i = 0; i < locations.length; i++) {
                var loc = locations[i];
                if (searchMatches(q, loc)) {
                    writeMatch(q, 'location', loc);
                }
            }
        })
}

function searchCallAssignments(z, orgId, q, writeMatch) {
    return z.resource('orgs', orgId, 'call_assignments').get()
        .then(function(result) {
            let assignments = result.data.data;

            for (let i = 0; i < assignments.length; i++) {
                let assignment = assignments[i];
                if (searchMatches(q, assignment)) {
                    writeMatch(q, 'call_assignment', assignment);
                };
            }
        });
}

function searchCampaigns(z, orgId, q, writeMatch) {
    return z.resource('orgs', orgId, 'campaigns').get()
        .then(function(result) {
            var i;
            var campaigns = result.data.data;

            for (i = 0; i < campaigns.length; i++) {
                var campaign = campaigns[i];
                if (searchMatches(q, campaign)) {
                    writeMatch(q, 'campaign', campaign);
                }
            }
        });
}

function searchSurveys(z, orgId, q, writeMatch) {
    return z.resource('orgs', orgId, 'surveys').get()
        .then(function(result) {
            result.data.data.forEach(survey => {
                if (searchMatches(q, survey)) {
                    writeMatch(q, 'survey', survey);
                }
            });
        });
}

function searchSurveySubmissions(z, orgId, q, writeMatch) {
    // TODO: Filter in API
    return z.resource('orgs', orgId, 'survey_submissions').get()
        .then(result => {
            result.data.data.forEach(sub => {
                if (sub.respondent && searchMatches(q, sub.respondent)) {
                    writeMatch(q, 'survey_submission', sub);
                }
            });
        });
}

export default search;
