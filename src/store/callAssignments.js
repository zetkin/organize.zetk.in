import { createList, updateOrAddListItem } from '../utils/store';
import * as types from '../actions';


export default function callAssignments(state = null, action) {
    switch (action.type) {
        case types.CREATE_CALL_ASSIGNMENT_DRAFT:
            let assignment = action.payload.assignment;
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment, { isDraft: true }),
            });
            
        default:
            return state || {
                assignmentList: createList(),
            };
    }
}
