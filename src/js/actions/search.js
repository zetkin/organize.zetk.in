import { Actions } from 'flummox';


export default class SearchActions extends Actions {
    search(query) {
        return query;
    }

    beginSearch(scope) {
        return scope;
    }

    endSearch() {
        return true;
    }

    clearSearch() {
        return true;
    }
}
