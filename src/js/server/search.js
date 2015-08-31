import Z from 'zetkin';

import searchMatches from '../utils/searchMatches';


function search(ws, req) {
    var queue;

    ws.on('message', function(json) {
        var msg = JSON.parse(json);

        var writeFunc = function(query, type, data) {
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
        }

        if (!msg.scope || msg.scope == 'maps') {
            searchFuncs.push(searchLocations);
        }

        if (!msg.scope || msg.scope == 'campaign') {
            searchFuncs.push(searchActions);
            searchFuncs.push(searchCampaigns);
        }

        queue = new SearchQueue(msg.org, msg.query, writeFunc, searchFuncs);
        queue.run();
    });
}

function SearchQueue(orgId, query, writeMatch, searchFuncs) {
    var _idx = 0;
    var _writeMatch = writeMatch;

    var _proceed = function() {
        if (_idx < searchFuncs.length) {
            const searchFunc = searchFuncs[_idx++];
            const promise = searchFunc(orgId, query, writeMatch)

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
        }
    };

    this.run = function() {
        _proceed();
    }

    this.abort = function() {
        _idx = searchFuncs.length;
        _writeMatch = (type, data) => null;
    }
}

function searchActions(orgId, q, writeMatch) {
    var date = Date.utc.create(q);
    if (date.isValid()) {
        const dateStr = date.format('{yyyy}-{MM}-{dd}');

        // Searching for date
        // TODO: Search using backend filtering
        return Z.resource('orgs', orgId, 'actions').get()
            .then(function(result) {
                const actions = result.data.data;
                const dayActions = [];

                var i;
                for (i = 0; i < actions.length; i++) {
                    var action = actions[i];
                    var actionDate = new Date(action.start_time);
                    if (actionDate.is(dateStr)) {
                        dayActions.push(action);
                    }
                }

                if (dayActions.length > 0) {
                    const matchData = {
                        date: dateStr,
                        action_count: dayActions.length
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

function searchPeople(orgId, q, writeMatch) {
    // TODO: Use API-side filtering once implemented
    return Z.resource('orgs', orgId, 'people').get()
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

function searchLocations(orgId, q, writeMatch) {
    return Z.resource('orgs', orgId, 'locations').get()
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

function searchCampaigns(orgId, q, writeMatch) {
    return Z.resource('orgs', orgId, 'campaigns').get()
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

export default search;
