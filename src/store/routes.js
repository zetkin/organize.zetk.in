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
    else if (action.type == types.RETRIEVE_ROUTES + '_FULFILLED') {
        let routes = action.payload.data.data;

        return Object.assign({}, state, {
            routeList: createList(routes),
        });
    }
    else if (action.type == types.ADD_ADDRESSES_TO_ROUTE + '_FULFILLED') {
        // The action is actually multiple PUTs to the API, and will return
        // the route after each change. Get the route after the last change,
        // i.e. the one with the maximum value.
        let routeAfterAll = action.payload[0].data.data;
        action.payload.forEach(payload => {
            let route = payload.data.data;
            if (route.household_count > routeAfterAll.household_count) {
                routeAfterAll = route;
            }
        });

        return Object.assign({}, state, {
            routeList: updateOrAddListItem(state.routeList,
                routeAfterAll.id, routeAfterAll),
        });
    }
    else if (action.type == types.REMOVE_ADDRESSES_FROM_ROUTE + '_FULFILLED') {
        // The action is actually multiple DELETEs to the API, and will return
        // the route after each change. Get the route after the last change,
        // i.e. the one with the minimum value.
        let routeAfterAll = action.payload[0].data.data;
        action.payload.forEach(payload => {
            let route = payload.data.data;
            if (route.household_count < routeAfterAll.household_count) {
                routeAfterAll = route;
            }
        });

        return Object.assign({}, state, {
            routeList: updateOrAddListItem(state.routeList,
                routeAfterAll.id, routeAfterAll),
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
