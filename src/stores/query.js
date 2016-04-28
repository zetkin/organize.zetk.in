import { Store } from 'flummox';


export default class QueryStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;

        // TODO: Call directly on this
        super.setState({
            queries: []
        });

        const queryActions = flux.getActions('query');
        this.register(queryActions.createQuery, this.onCreateQuery);
        this.register(queryActions.addFilter, this.onAddFilter);
        this.register(queryActions.updateFilter, this.onUpdateFilter);
        this.register(queryActions.removeFilter, this.onRemoveFilter);

        // TODO: Remove once platform supports queries
        this.register(queryActions.loadQueriesFromLocalStorage,
            this.onLoadQueriesFromLocalStorage);
    }

    getQueries() {
        return this.state.queries;
    }

    getQuery(id) {
        return this.state.queries.find(q => q.id == id);
    }

    executeQuery(queryId, people) {
        const query = this.state.queries.find(q => q.id == queryId);
        return people.filter(p => matchesQuery(p, query));
    }

    onCreateQuery(title) {
        const queries = this.state.queries;
        const id = queries.length?
            queries[queries.length-1].id + 1 : 1;

        const query = {
            id, title,
            filters: []
        };

        this.setState({
            queries: queries.concat([ query ])
        });
    }

    onAddFilter(payload) {
        const queryId = payload.queryId;
        const filterType = payload.filterType;

        const query = this.state.queries.find(q => q.id == queryId);
        const getDefault = defaultConfigs[filterType];

        query.filters.push({
            type: filterType,
            config: getDefault()
        });

        this.setState({
            queries: this.state.queries
        });
    }

    onUpdateFilter(payload) {
        const queryId = payload.queryId;
        const filterIndex = payload.filterIndex;
        const filterConfig = payload.filterConfig;

        const query = this.state.queries.find(q => q.id == queryId);
        query.filters[filterIndex].config = filterConfig;

        this.setState({
            queries: this.state.queries
        });
    }

    onRemoveFilter(payload) {
        const queryId = payload.queryId;
        const filterIndex = payload.filterIndex;

        const query = this.state.queries.find(q => q.id == queryId);
        query.filters.splice(filterIndex, 1);

        this.setState({
            queries: this.state.queries
        });
    }

    // TODO: Remove once platform supports queries
    onLoadQueriesFromLocalStorage() {
        // TODO: Don't get from local storage
        if (typeof window !== 'undefined') {
            const json = localStorage.getItem('storedPersonQueries');
            if (json) {
                this.setState({
                    queries: JSON.parse(json) || []
                });
            }
        }
    }

    // TODO: Remove once server is implemented
    setState(newState) {
        if (newState.queries && typeof window !== 'undefined') {
            const json = JSON.stringify(newState.queries);
            window.localStorage.setItem('storedPersonQueries', json);
        }

        super.setState(newState);
    }
}

function matchesQuery(person, query) {
    for (let i = 0; i < query.filters.length; i++) {
        let filter = query.filters[i];

        if (filter.type in filterFunctions) {
            let func = filterFunctions[filter.type];
            // TODO: Implement boolean relationships
            if (!func(person, filter.config)) {
                return false;
            }
        }
    }

    return true;
}

let filterFunctions = {
    person_data: function matchPersonData(person, filterConfig) {
        const field = filterConfig.field;
        const qs = filterConfig.text.toLowerCase();

        for (let key in person) {
            if (!field || field == '*' || field == key) {
                let val = person[key];
                if (val && val.toString().toLowerCase().indexOf(qs) >= 0) {
                    return true;
                }
            }
        }

        return false;
    },

    join_date: function matchJoinDate(person, filterConfig) {
        // TODO: Implement once join date is actually on person object
        // Mock an actual query, for demo purposes
        const date = Date.create(filterConfig.date);
        const dateStr = date.format('{yyyy}{MM}{dd}');
        const dateSum = dateStr.split('')
            .reduce((x,y) => (parseInt(x) + parseInt(y)));
        const pid = Math.floor(person.id/10);
        return ((pid % 3) == (dateSum % 3));
    },

    campaign: function matchCampaign(person, filterConfig) {
        if (!filterConfig.campaign)
            return true;

        // TODO: Implement server-side
        // Mock an actual query, for demo purposes
        const pid = Math.floor(person.id/10);
        return ((pid % 5) == (filterConfig.campaign % 5));
    }
};

let defaultConfigs = {
    person_data: function getPersonDataDefault() {
        return {
            field: undefined,
            text: ''
        }
    },

    join_date: function getJoinDateDefault() {
        const jan1 = new Date((new Date()).getFullYear(), 0, 1);

        return {
            operator: 'gt',
            date: jan1.format('{yyyy}-{MM}-{dd}')
        }
    },

    campaign: function getCampaignDefault() {
        return {
            operator: 'in',
            campaign: undefined
        }
    }
};
