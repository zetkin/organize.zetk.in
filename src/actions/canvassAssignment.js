import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function createCanvassAssignment(data, paneId) {
    return ({ dispatch, getState, z }) => {
        dispatch({
            type: types.CREATE_CANVASS_ASSIGNMENT,
            meta: { paneId },
            payload: {
                // TODO: Submit to API
                promise: new Promise(resolve => {
                    resolve({
                        data: {
                            data: Object.assign({}, data, {
                                id: makeRandomString(5),
                            }),
                        },
                    });
                }),
            }
        });
    };
}

export function updateCanvassAssignment(id, data) {
    return ({ dispatch, getState, z }) => {
        // TODO: Don't retrieve this once hooked up to API
        let assignmentItem = getState().canvassAssignments.assignmentList.items.find(a => a.data.id == id);

        dispatch({
            type: types.UPDATE_CANVASS_ASSIGNMENT,
            payload: {
                // TODO: Submit to API
                promise: new Promise(resolve => {
                    resolve({
                        data: {
                            data: Object.assign({}, assignmentItem.data, data),
                        },
                    });
                }),
            },
        });
    };
}
