import * as types from '.';
import makeRandomString from '../utils/makeRandomString';
import { getListItemById } from '../utils/store';


export function createSelection(objType, selectedIds,
                                instructions, doneCallback, meta) {

    let id = '$' + makeRandomString(6);
    selectedIds = selectedIds || [];

    return {
        type: types.CREATE_SELECTION,
        payload: { id, objType, selectedIds, instructions, doneCallback, meta },
    };
}

export function addToSelection(id, objId) {
    return {
        type: types.ADD_TO_SELECTION,
        payload: { id, objId },
    };
}

export function removeFromSelection(id, objId) {
    return {
        type: types.REMOVE_FROM_SELECTION,
        payload: { id, objId },
    };
}

export function clearSelection(id) {
    return {
        type: types.CLEAR_SELECTION,
        payload: { id },
    };
}

export function finishSelection(id) {
    return ({ dispatch, getState }) => {
        let selectionList = getState().selections.selectionList;
        let selection = getListItemById(selectionList, id);

        selection.data.doneCallback(selection.data.selectedIds);

        dispatch({
            type: types.FINISH_SELECTION,
            payload: { id },
        });
    };
}
