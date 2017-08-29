import * as types from '../actions';
import {
    createList,
} from '../utils/store';


export default function addresses(state = null, action) {
    if (action.type == types.RETRIEVE_ADDRESSES) {
        // TODO: Handle async action
        let rand = [];

        for (let i = 0; i < 100; i++) {
            rand.push({
                id: i,
                street: '',
                latitude: 55.596 + (Math.random() - 0.5) * 0.05,
                longitude: 13.011 + (Math.random() - 0.5) * 0.1,
            });
        }

        return Object.assign({}, state, {
            addressList: createList(rand),
        });
    }
    else {
        return state || {
            addressList: createList(),
        };
    }
}
