import * as types from '../actions';
import {
    createList,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
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
    else if (action.type == types.RETRIEVE_ASSIGNED_ROUTES + '_FULFILLED') {
        let assignedRoutes = action.payload.data.data;
        let routesById = {};

        assignedRoutes.forEach(ar => {
            if (!routesById.hasOwnProperty(ar.route.id)) {
                routesById[ar.route.id] = ar.route;
            }
        });

        let routes = Object.keys(routesById).map(id => routesById[id]);

        return Object.assign({}, state, {
            assignedRouteList: createList(assignedRoutes),
            routeList: updateOrAddListItems(state.routeList, routes),
        });
    }
    else if (action.type == types.RETRIEVE_ASSIGNED_ROUTE + '_FULFILLED') {
        let ar = action.payload.data.data;

        return Object.assign({}, state, {
            assignedRouteList: updateOrAddListItem(state.assignedRouteList, ar.id, ar),
            routeList: updateOrAddListItem(state.routeList, ar.route.id, ar.route),
        });
    }
    else if (action.type == types.RETRIEVE_CANVASS_ASSIGNMENT_ROUTES + '_FULFILLED') {
        let routes = action.payload.data.data;

        return Object.assign({}, state, {
            routesByAssignment: Object.assign({}, state.routesByAssignment, {
                [action.meta.assignmentId]: createList(routes),
            }),
            routeList: updateOrAddListItems(state.routeList, routes),
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
    else if (action.type == types.ADD_ROUTES_TO_CANVASS_ASSIGNMENT + '_FULFILLED') {
        let assignmentId = action.meta.id;
        let routes = action.payload.map(p => p.data.data);
        let routesByAssignment = Object.assign({}, state.routesByAssignment);

        if (routesByAssignment[assignmentId]) {
            routesByAssignment[assignmentId] =
                updateOrAddListItems(routesByAssignment[assignmentId], routes);
        }
        else {
            routesByAssignment[assignmentId] = createList(routes);
        }

        return Object.assign({}, state, {
            routeList: updateOrAddListItems(state.routeList, routes),
            routesByAssignment: routesByAssignment,
        });
    }
    else if (action.type == types.REMOVE_ROUTES_FROM_CANVASS_ASSIGNMENT + '_FULFILLED') {
        let assignmentId = action.meta.id;
        let routesByAssignment = Object.assign({}, state.routesByAssignment);

        if (!routesByAssignment[assignmentId]) {
            return state;
        }

        action.meta.routeIds.forEach(routeId => {
            routesByAssignment[assignmentId] =
                removeListItem(routesByAssignment[assignmentId], routeId);
        });

        return Object.assign({}, state, {
            routesByAssignment: routesByAssignment,
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
            routesByAssignment: {},
            assignedRouteList: createList(),
        };
    }
}
