import { Actions } from 'flummox';


export default class SearchActions extends Actions {
    search(query) {
        return query;
    }

    clearSearch() {
        return true;
    }
}
