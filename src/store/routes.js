import * as types from '../actions';
import {
    createList,
} from '../utils/store';


export default function routes(state = null, action) {
    if (action.type == types.GENERATE_ROUTES + '_PENDING') {
        return Object.assign({}, state, {
            draftList: null,
            generator: Object.assign({}, state.generator, {
                isPending: true,
                info: action.meta.info,
            }),
        });
    }
    else if (action.type == types.GENERATE_ROUTES + '_FULFILLED') {
        return Object.assign({}, state, {
            draftList: createList(action.data.routes),
            generator: Object.assign({}, state.generator, {
                isPending: false,
            }),
        });
    }
    else if (action.type == types.DISCARD_ROUTE_DRAFTS) {
        return Object.assign({}, state, {
            draftList: null,
        });
    }
    else {
        return state || {
            generator: {
                isPending: false,
                info: null,
            },
            draftList: null,
            routeList: createList(),
        };
    }
}
