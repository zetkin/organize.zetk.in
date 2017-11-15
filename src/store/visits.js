import * as types from '../actions';
import {
    createList,
    updateOrAddListItems,
} from '../utils/store';


export default function visits(state = null, action) {
    if (action.type == types.RETRIEVE_HOUSEHOLD_VISITS + '_FULFILLED'
        || action.type == types.UPDATE_ASSIGNED_ROUTE_VISITS + '_FULFILLED') {

        let householdVisits = action.payload.data.data;
        let visitsByRouteAndAddress = {};

        householdVisits.forEach(hhv => {
            let addr = hhv.address;
            let ar = hhv.assigned_route;
            let key = ar.id + '-' + addr.id;

            if (!visitsByRouteAndAddress.hasOwnProperty(key)) {
                visitsByRouteAndAddress[key] = {
                    id: addr.id,
                    ar_id: ar.id,
                    address: addr.address,
                    state: hhv.state,
                    households_visited: 0,
                    households_allocated: 0,
                };
            }

            visitsByRouteAndAddress[key].households_allocated++;

            if (hhv.visit_time) {
                visitsByRouteAndAddress[key].households_visited++;
            }
        });

        let addressVisits = Object.keys(visitsByRouteAndAddress).map(id => visitsByRouteAndAddress[id]);

        return Object.assign({}, state, {
            addressVisitList: updateOrAddListItems(
                state.addressVisitList, addressVisits),
            householdVisitList: updateOrAddListItems(
                state.householdVisitList, householdVisits),
        });
    }
    else {
        return state || {
            addressVisitList: createList(),
            householdVisitList: createList(),
        };
    }
}
