import * as types from '../actions';
import {
    createList,
} from '../utils/store';


export default function routes(state = null, action) {
    if (action.type == types.GENERATE_ROUTES + '_COMPLETE') {
        return Object.assign({}, state, {
            draftList: createList(action.data.routes),
        });
    }
    else if (action.type == types.DISCARD_ROUTE_DRAFTS) {
        return Object.assign({}, state, {
            draftList: null,
        });
    }
    else {
        return state || {
            draftList: null,
            routeList: createList(),
        };
    }
}
