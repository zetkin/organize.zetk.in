import * as types from '../actions';
import {
    createList,
    createListItem,
    createListItems,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function callAssignments(state = null, action) {
    let assignment;
    let caller;
    let tags;

    switch (action.type) {
        case types.CREATE_CALL_ASSIGNMENT + '_FULFILLED':
            assignment = action.payload.data.data;
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

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

        case types.RETRIEVE_CALL_ASSIGNMENT + '_PENDING':
            assignment = { id: action.meta.id };
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment, { isPending: true })
            });

        case types.RETRIEVE_CALL_ASSIGNMENT + '_FULFILLED':
            assignment = action.payload.data.data;
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment, { isPending: false })
            });

        case types.RETRIEVE_CALL_ASSIGNMENT_STATS + '_PENDING':
            assignment = {
                id: action.meta.id,
                statsItem: createListItem(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.RETRIEVE_CALL_ASSIGNMENT_STATS + '_FULFILLED':
            assignment = {
                id: action.meta.id,
                statsItem: createListItem(action.payload.data.data),
            };

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.UPDATE_QUERY + '_FULFILLED':
            // Check if there is an assignment that uses this query
            let queryId = action.payload.data.data.id;
            let assignmentItem = state.assignmentList.items.find(i => i.data &&
                (i.data.target.id === queryId || i.data.goal.id === queryId));

            // If the query that was updated affects an assignment,
            // remove the stats to indicate that they were invalidated
            if (assignmentItem) {
                return Object.assign({}, state, {
                    assignmentList: updateOrAddListItem(state.assignmentList,
                        assignmentItem.data.id, { statsItem: null }),
                });
            }
            else {
                return state;
            }

        case types.RETRIEVE_CALL_ASSIGNMENT_CALLERS + '_PENDING':
            assignment = {
                id: action.meta.id,
                callerList: createList(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
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

        case types.REMOVE_CALL_ASSIGNMENT_CALLER + '_FULFILLED':
            assignment = getListItemById(state.assignmentList,
                action.meta.id).data;

            assignment.callerList = removeListItem(assignment.callerList,
                action.meta.callerId);

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment)
            });

        case types.ADD_CALLER_PRIORITIZED_TAGS + '_FULFILLED':
            assignment = getListItemById(state.assignmentList,
                action.meta.assignmentId).data;

            caller = getListItemById(assignment.callerList,
                action.meta.callerId).data;

            tags = action.payload.map(p => p.data.data);

            caller = Object.assign({}, caller, {
                prioritized_tags: caller.prioritized_tags.concat(tags),
            });

            assignment = Object.assign({}, assignment, {
                callerList: updateOrAddListItem(assignment.callerList,
                    caller.id, caller),
            });

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.ADD_CALLER_EXCLUDED_TAGS + '_FULFILLED':
            assignment = getListItemById(state.assignmentList,
                action.meta.assignmentId).data;

            caller = getListItemById(assignment.callerList,
                action.meta.callerId).data;

            tags = action.payload.map(p => p.data.data);

            caller = Object.assign({}, caller, {
                excluded_tags: caller.excluded_tags.concat(tags),
            });

            assignment = Object.assign({}, assignment, {
                callerList: updateOrAddListItem(assignment.callerList,
                    caller.id, caller),
            });

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.REMOVE_CALLER_PRIORITIZED_TAGS + '_FULFILLED':
            assignment = getListItemById(state.assignmentList,
                action.meta.assignmentId).data;

            caller = getListItemById(assignment.callerList,
                action.meta.callerId).data;

            caller = Object.assign({}, caller, {
                prioritized_tags: caller.prioritized_tags.filter(t =>
                    action.meta.tagIds.indexOf(t.id) < 0)
            });

            assignment = Object.assign({}, assignment, {
                callerList: updateOrAddListItem(assignment.callerList,
                    caller.id, caller),
            });

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.REMOVE_CALLER_EXCLUDED_TAGS + '_FULFILLED':
            assignment = getListItemById(state.assignmentList,
                action.meta.assignmentId).data;

            caller = getListItemById(assignment.callerList,
                action.meta.callerId).data;

            caller = Object.assign({}, caller, {
                excluded_tags: caller.excluded_tags.filter(t =>
                    action.meta.tagIds.indexOf(t.id) < 0)
            });

            assignment = Object.assign({}, assignment, {
                callerList: updateOrAddListItem(assignment.callerList,
                    caller.id, caller),
            });

            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment),
            });

        case types.UPDATE_CALL_ASSIGNMENT + '_FULFILLED':
            assignment = action.payload.data.data
            return Object.assign({}, state, {
                assignmentList: updateOrAddListItem(state.assignmentList,
                    assignment.id, assignment, { isPending: false, error: null }),
            });

        default:
            return state || {
                assignmentList: createList(),
            };
    }
}
