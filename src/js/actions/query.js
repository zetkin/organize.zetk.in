import { Actions } from 'flummox';


export default class QueryActions extends Actions {
    updateFilter(queryId, filterIndex, filterConfig) {
        return { queryId, filterIndex, filterConfig };
    }
}
