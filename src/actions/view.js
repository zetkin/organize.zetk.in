import * as types from '.';


export function setPanesFromUrlPath(path) {
    return {
        type: types.SET_PANES_FROM_URL_PATH,
        payload: { path },
    };
}

export function openPane(index, paneType, params) {
    return {
        type: types.OPEN_PANE,
        payload: { index, paneType, params },
    };
}

export function closePane(index) {
    return {
        type: types.CLOSE_PANE,
        payload: { index },
    };
}

export function replacePane(index, paneType, params) {
    return {
        type: types.REPLACE_PANE,
        payload: { index, paneType, params },
    };
}

export function pushPane(paneType, params) {
    return {
        type: types.PUSH_PANE,
        payload: { paneType, params },
    };
}

export function gotoSection(section, subSection) {
    return {
        type: types.GOTO_SECTION,
        payload: { section, subSection },
    }
}
