import * as types from '../actions';
import {
    createList,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
} from '../utils/store';

export default function selections(state = null, action) {
    let selection;

    switch (action.type) {
        case types.CREATE_SELECTION:
            let selection = action.payload;
            return Object.assign({}, state, {
                selectionList: updateOrAddListItem(state.selectionList,
                    selection.id, selection),
            });

        case types.ADD_TO_SELECTION:
            selection = Object.assign({}, getListItemById(
                state.selectionList, action.payload.id).data);

            // Add object ID if it is not already in the selected set
            if (selection.selectedIds.indexOf(action.payload.objId) < 0) {
                selection.selectedIds = selection.selectedIds.concat([
                    action.payload.objId ]);
            }

            return Object.assign({}, state, {
                selectionList: updateOrAddListItem(state.selectionList,
                    selection.id, selection),
            });

        case types.REMOVE_FROM_SELECTION:
            selection = Object.assign({}, getListItemById(
                state.selectionList, action.payload.id).data);

            // Filter out the ID to be removed
            selection.selectedIds = selection.selectedIds.filter(id =>
                id != action.payload.objId);

            return Object.assign({}, state, {
                selectionList: updateOrAddListItem(state.selectionList,
                    selection.id, selection),
            });

        case types.FINISH_SELECTION:
            let id = action.payload.id;
            return Object.assign({}, state, {
                selectionList: removeListItem(state.selectionList, id),
            });

        default:
            return state || {
                selectionList: createList(),
            };
    }
}
