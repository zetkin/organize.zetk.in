import * as types from '.';
import makeRandomString from '../utils/makeRandomString';
import { getListItemById } from '../utils/store';


export function createSelection(objType, selectedIds,
                                instructions, doneCallback) {

    let id = '$' + makeRandomString(6);
    selectedIds = selectedIds || [];

    return {
        type: types.CREATE_SELECTION,
        payload: { id, objType, selectedIds, instructions, doneCallback },
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
