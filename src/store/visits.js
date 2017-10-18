import * as types from '../actions';
import {
    createList,
    updateOrAddListItems,
} from '../utils/store';


export default function visits(state = null, action) {
    if (action.type == types.RETRIEVE_HOUSEHOLD_VISITS + '_FULFILLED') {
        let visits = action.payload.data.data;
        return Object.assign({}, state, {
            householdVisitList: updateOrAddListItems(
                state.householdVisitList, visits),
        });
    }
    else {
        return state || {
            householdVisitList: createList,
        };
    }
}
