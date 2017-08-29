import * as types from '../actions';
import {
    createList,
} from '../utils/store';


export default function routes(state = null, action) {
    if (action.type == types.GENERATE_ROUTES + '_COMPLETE') {
        console.log(action.data.routes);

        return Object.assign({}, state, {
            draftList: createList(action.data.routes),
        });
    }
    else {
        return state || {
            draftList: createList(),
            routeList: createList(),
        };
    }
}
