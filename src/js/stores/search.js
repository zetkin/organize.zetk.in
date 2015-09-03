import { Store } from 'flummox';

import searchMatches from '../utils/searchMatches';


export default class SearchStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;
        this.ws = null;
        this.wsOpen = false;

        this.setState({
            query: '',
            isActive: false,
            scope: null,
            results: []
        });

        var searchActions = flux.getActions('search');
        this.register(searchActions.search, this.onSearch);
        this.register(searchActions.beginSearch, this.onBeginSearch);
        this.register(searchActions.changeScope, this.onChangeScope);
        this.register(searchActions.endSearch, this.onEndSearch);
        this.register(searchActions.clearSearch, this.onClearSearch);
    }

    getQuery() {
        return this.state.query;
    }

    getResults() {
        return this.state.results;
    }

    getScope() {
        return this.state.scope;
    }

    isSearchActive() {
        return this.state.isActive;
    }

    onBeginSearch(scope) {
        // Don't override scope if undefined
        if (scope === undefined)
            scope = this.state.scope;

        // TODO: Open WS already at this point?
        this.setState({
            isActive: true,
            scope: scope
        });
    }

    onChangeScope(scope) {
        if (scope != this.state.scope) {
            this.setState({
                scope: scope
            });

            this.execSearch(this.state.query, scope, []);
        }
    }

    onEndSearch() {
        this.ws = null;
        this.wsOpen = false;

        this.setState({
            isActive: false
        });
    }

    onClearSearch() {
        this.setState({
            query: '',
            isActive: false,
            scope: null,
            results: []
        });
    }

    onSearch(query) {
        this.execSearch(query, this.state.scope, this.state.results);
    }

    execSearch(query, scope, initialResults) {
        var orgId = this.flux.getStore('org').getActiveId();

        this.setState({
            isActive: true,
            query: query
        });

        if (query.length < 3) {
            // String too short, so we treat this as if there was
            // no search active at all (and remove all results)
            this.setState({
                results: []
            });
        }
        else {
            // Remove results that no longer match
            this.setState({
                results: initialResults
                    .filter(r => searchMatches(query, r.data))
            });

            // TODO: When queries are in the platform, move this server-side
            // Search for person queries (inconveniantly named "queries" like
            // the search query string that is the input to this function).
            const queries = this.flux.getStore('query').getQueries();
            this.setState({
                results: this.state.results.concat(queries
                    .filter(q => searchMatches(query, q))
                    .map(q => ({ type: 'query', data: q })))
            });
        }

        var sendQuery = function(query) {
            // Don't search for really short query strings
            if (query.length >= 3) {
                this.ws.send(JSON.stringify({
                    'cmd': 'search',
                    'scope': scope,
                    'org': orgId,
                    'query': query
                }));
            }
        }.bind(this);

        if (!this.wsOpen) {
            if (!this.ws) {
                var url = 'ws://' + window.location.host + '/search';

                this.ws = new WebSocket(url);
                this.ws.onopen = function() {
                    this.wsOpen = true;
                    sendQuery(this.state.query);
                }.bind(this);

                this.ws.onmessage = function(ev) {
                    var msg = JSON.parse(ev.data);

                    if (msg.cmd == 'match' && msg.query == this.state.query) {
                        var existing = this.state.results.find(
                            m => (m.type == msg.match.type
                                    && m.data.id == msg.match.data.id));

                        if (existing === undefined) {
                            this.state.results.push(msg.match);
                            this.setState({
                                results: this.state.results
                            });
                        }
                    }

                }.bind(this);
            }
        }
        else {
            sendQuery(query);
        }
    }
}
