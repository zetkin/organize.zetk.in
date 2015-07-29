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
        // TODO: Open WS already at this point?
        this.setState({
            isActive: true,
            scope: scope
        });
    }

    onEndSearch() {
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
        var orgId = this.flux.getStore('org').getActiveId();

        this.setState({
            isActive: true,
            query: query
        });

        if (query.length < 3) {
            // Don't search for really short query strings
            this.setState({
                results: []
            });
        }
        else {
            // Remove results that no longer match
            this.setState({
                results: this.state.results
                    .filter(r => searchMatches(query, r.data))
            });

            var sendQuery = function(query) {
                this.ws.send(JSON.stringify({
                    'cmd': 'search',
                    'org': orgId,
                    'query': query
                }));
            }.bind(this);

            if (!this.wsOpen) {
                if (!this.ws) {
                    // TODO: Don't hardcode this URL
                    this.ws = new WebSocket('ws://organize.zetk.in:4080/search');
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
}
