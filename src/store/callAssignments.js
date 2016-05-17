import * as types from '../actions';
import {
    createList,
    createListItems,
    getListItemById,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function callAssignments(state = null, action) {
    let assignment;

    switch (action.type) {
        case types.RETRIEVE_CALL_ASSIGNMENTS + '_PENDING':
            return Object.assign({}, state, {
                assignmentList: Object.assign({}, state.assignmentList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_CALL_ASSIGNMENTS + '_FULFILLED':
            return Object.assign({}, state, {
                assignmentList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_CALL_ASSIGNMENTS + '_REJECTED':
            return Object.assign({}, state, {
                assignmentList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_CALL_ASSIGNMENT_CALLERS + '_FULFILLED':
            assignment = {
                id: action.meta.id,
                callerList: createList(action.payload.data.data)
            };

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.ADD_CALL_ASSIGNMENT_CALLERS + '_FULFILLED':
            let addedCallers = action.payload.map(p => p.data.data);
            assignment = getListItemById(state.assignmentList,
                action.meta.id).data;

            assignment.callerList = updateOrAddListItems(assignment.callerList,
                addedCallers, { isPending: false, error: null });

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment)
            });

        case types.UPDATE_CALL_ASSIGNMENT + '_FULFILLED':
            assignment = action.payload.data.data
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment, { isPending: false, error: null }),
            });

        case types.CREATE_CALL_ASSIGNMENT_DRAFT:
            assignment = action.payload.assignment;
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
