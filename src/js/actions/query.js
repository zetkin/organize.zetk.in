import { Actions } from 'flummox';


export default class QueryActions extends Actions {
    // TODO: Remove once platform supports queries
    loadQueriesFromLocalStorage() {
        return true;
    }

    createQuery(title) {
        return title;
    }

    updateFilter(queryId, filterIndex, filterConfig) {
        return { queryId, filterIndex, filterConfig };
    }

    addFilter(queryId, filterType) {
        return { queryId, filterType };
    }

    removeFilter(queryId, filterIndex) {
        return { queryId, filterIndex };
    }
}
