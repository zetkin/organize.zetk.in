import * as types from '.';


export function setPrintData(data) {
    return {
        type: types.SET_PRINT_DATA,
        payload: { data },
    };
}
