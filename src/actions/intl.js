import * as types from '.';


export function setIntlData(data) {
    return {
        type: types.SET_INTL_DATA,
        payload: { data },
    };
}
