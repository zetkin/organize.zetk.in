import url from 'url';
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

        queue = new SearchQueue(msg.org, msg.query, writeFunc, [
            searchPeople
        ]);
    });
}

function SearchQueue(orgId, query, writeMatch, searchFuncs) {
    var _idx = 0;
    var _writeMatch = writeMatch;

    var _proceed = function() {
        if (_idx < searchFuncs.length) {
            var searchFunc = searchFuncs[_idx++];
            searchFunc(orgId, query, writeMatch)
                .then(function() {
                    _proceed();
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
        else {
            // Done!
        }
    };

    _proceed();

    this.abort = function() {
        _idx = searchFuncs.length;
        _writeMatch = (type, data) => null;
    }
}

function searchPeople(orgId, q, writeMatch) {
    // TODO: Use API-side filtering once implemented
    return Z.resource('orgs', orgId, 'people').get()
        .then(function(result) {
            var i;
            var people = result.data.data;

            for (i in people) {
                var p = people[i];
                if (searchMatches(q, p)) {
                    writeMatch(q, 'person', p);
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

export default search;
