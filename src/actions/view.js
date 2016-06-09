import * as types from '.';


export function setPanesFromUrlPath(path) {
    return {
        type: types.SET_PANES_FROM_URL_PATH,
        payload: { path },
    };
}
