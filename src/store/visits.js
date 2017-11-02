import * as types from '../actions';
import {
    createList,
    updateOrAddListItems,
} from '../utils/store';


export default function visits(state = null, action) {
    if (action.type == types.RETRIEVE_HOUSEHOLD_VISITS + '_FULFILLED'
        || action.type == types.UPDATE_ASSIGNED_ROUTE_VISITS + '_FULFILLED') {

        let householdVisits = action.payload.data.data;
        let visitsByAddress = {};

        householdVisits.forEach(hhv => {
            let addr = hhv.address;
            if (!visitsByAddress.hasOwnProperty(addr.id)) {
                visitsByAddress[addr.id] = {
                    id: addr.id,
                    address: addr.address,
                    state: hhv.state,
                    households_visited: 0,
                    households_allocated: 0,
                };
            }

            visitsByAddress[addr.id].households_allocated++;

            if (hhv.visit_time) {
                visitsByAddress[addr.id].households_visited++;
            }
        });

        let addressVisits = Object.keys(visitsByAddress).map(id => visitsByAddress[id]);

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
