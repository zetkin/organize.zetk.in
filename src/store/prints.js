import * as types from '../actions';


export default function prints(state = null, action) {
    if (action.type == types.SET_PRINT_DATA) {
        return {
            printData: action.payload.data,
        };
    }
    else {
        return state || {};
    }
}
