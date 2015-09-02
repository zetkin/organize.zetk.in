import { Store } from 'flummox';


export default class QueryStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;

        // TODO: Get rid of dummy data
        this.setState({
            queries: [
                {
                    id: 1,
                    title: 'My Query',
                    filters: [{
                        type: 'person_data',
                        config: {
                            text: 'larsson',
                            fields: null // All fields
                        }
                    }]
                }
            ]
        });

        const queryActions = flux.getActions('query');
        this.register(queryActions.updateFilter, this.onUpdateFilter);
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
}

function matchesQuery(person, query) {
    for (let i = 0; i < query.filters.length; i++) {
        let filter = query.filters[i];

        if (filter.type in filterFunctions) {
            let func = filterFunctions[filter.type];
            if (func(person, filter.config)) {
                return true;
            }
        }
    }

    return false;
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
    }
};
