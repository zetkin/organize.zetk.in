import { Actions } from 'flummox';
import WebSocket from 'ws';


export default class SearchActions extends Actions {
    search(query) {
        return query;
    }
}
