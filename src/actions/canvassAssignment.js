import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function createCanvassAssignment(data, paneId) {
    return ({ dispatch, getState, z }) => {
        dispatch({
            type: types.CREATE_CANVASS_ASSIGNMENT,
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
