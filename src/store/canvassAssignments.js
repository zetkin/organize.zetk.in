import * as types from '../actions';
import {
    createList,
    updateOrAddListItem,
} from '../utils/store';


export default function canvassAssignments(state = null, action) {
    if (action.type == types.RETRIEVE_CANVASS_ASSIGNMENTS + '_FULFILLED') {
        return Object.assign({}, state, {
            assignmentList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_CANVASS_ASSIGNMENT + '_FULFILLED') {
        let assignment = action.payload.data.data;

        return Object.assign({}, state, {
            assignmentList: updateOrAddListItem(
                state.assignmentList, assignment.id, assignment),
        });
    }
    else if (action.type == types.CREATE_CANVASS_ASSIGNMENT + '_FULFILLED') {
        let assignment = action.payload.data.data;

        return Object.assign({}, state, {
            assignmentList: updateOrAddListItem(
                state.assignmentList, assignment.id, assignment),
        });
    }
    else if (action.type == types.UPDATE_CANVASS_ASSIGNMENT + '_FULFILLED') {
        let assignment = action.payload.data.data;

        return Object.assign({}, state, {
            assignmentList: updateOrAddListItem(
                state.assignmentList, assignment.id, assignment),
        });
    }
    else {
        return state || {
            assignmentList: null,
        };
    }
}
