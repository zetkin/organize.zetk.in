import * as types from '../actions';


export default function intl(state = null, action) {
    if (action.type == types.SET_INTL_DATA) {
        return action.payload.data;
    }
    else {
        return state || {
            locale: 'en',
            messages: {},
        };
    }
}
