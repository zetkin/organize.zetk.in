import * as types from '../actions';
import {
    createList,
} from '../utils/store';


export default function addresses(state = null, action) {
    if (action.type == types.RETRIEVE_ADDRESSES) {
        // TODO: Handle async action
        let dummies = [];

        for (let i = 0; i < 100; i++) {
            let row = Math.floor(i/10);
            let col = i % 10;

            let lat = 55.590 + row * 0.005;
            let lng = 13.001 + col * 0.01;

            let street = 'Av ' + (row + 1);
            let number = col + 1;

            if (row % 2) {
                lng += 0.005;
                street = 'Street ' + (col + 1)
                number = row + 1;
            }

            dummies.push({
                id: i.toString(),
                street: street,
                number: number,
                title: number + ', ' + street,
                latitude: lat,
                longitude: lng,
            });
        }

        return Object.assign({}, state, {
            addressList: createList(dummies),
        });
    }
    else if (action.type == types.RETRIEVE_ADDRESSES + '_FULFILLED') {
        let addresses = action.payload;

        return Object.assign({}, state, {
            addressById: addresses.reduce((byId, a) => {
                byId[a.id] = a;
                return byId
            }, {}),
            addressList: createList(addresses),
        });
    }
    else {
        return state || {
            addressList: createList(),
        };
    }
}
