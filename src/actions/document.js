import * as types from '.';
import makeRandomString from '../utils/makeRandomString';
import { getListItemById } from '../utils/store';


export function createTextDocument(content, doneCallback) {
    let id = '$' + makeRandomString(6);
    return {
        type: types.CREATE_TEXT_DOCUMENT,
        payload: { id, content, doneCallback },
    };
}

export function saveTextDocument(id, content) {
    return {
        type: types.SAVE_TEXT_DOCUMENT,
        payload: { id, content },
    };
}

export function finishTextDocument(id) {
    return ({ dispatch, getState }) => {
        let docList = getState().documents.docList;
        let doc = getListItemById(docList, id);
        doc.data.doneCallback(doc.data.content);
    };
}
