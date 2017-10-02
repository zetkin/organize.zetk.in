import * as types from '../actions';
import {
    createList,
    updateOrAddListItem,
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
    else if (action.type == types.CREATE_ROUTE + '_FULFILLED') {
        let route = action.payload.data.data;

        return Object.assign({}, state, {
            routeList: updateOrAddListItem(state.routeList, route.id, route),
        });
    }
    else if (action.type == types.DISCARD_ROUTE_DRAFTS) {
        return Object.assign({}, state, {
            draftList: null,
        });
    }
    else if (action.type == types.COMMIT_ROUTE_DRAFTS) {
        let routes = action.payload.data;

        return Object.assign({}, state, {
            draftList: null,
            routeList: createList(routes),
        })
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
