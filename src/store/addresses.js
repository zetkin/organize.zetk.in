import * as types from '../actions';
import makeRandomString from '../utils/makeRandomString';
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
    else if (action.type == types.RETRIEVE_ADDRESSES + '_PENDING') {
        return Object.assign({}, state, {
            addressList: createList(null, {
                isPending: true,
            }),
        });
    }
    else if (action.type == types.RETRIEVE_ADDRESSES + '_FULFILLED') {
        let addresses = action.payload.data.data;

        let streets = [];
        let streetsByTitle = {};
        addresses.forEach(addr => {
            if (addr.street) {
                let street = streetsByTitle[addr.street];

                if (!street) {
                    street = {
                        id: '$' + makeRandomString(6),
                        title: addr.street,
                        addresses: [],
                    };

                    streets.push(street);
                    streetsByTitle[street.title] = street;
                }

                street.addresses.push(addr.id);
            }
        });

        return Object.assign({}, state, {
            addressById: addresses.reduce((byId, a) => {
                byId[a.id] = a;
                return byId
            }, {}),
            addressList: createList(addresses),
            streetList: createList(streets),
        });
    }
    else if (action.type == types.RETRIEVE_ROUTE_ADDRESSES + '_FULFILLED') {
        let routeId = action.meta.routeId;
        let addresses = action.payload.data.data;

        return Object.assign({}, state, {
            addressesByRoute: Object.assign({}, state.addressesByRoute, {
                [routeId]: addresses.map(a => a.id),
            }),
        });
    }
    else if (action.type == types.ADD_ADDRESSES_TO_ROUTE + '_FULFILLED') {
        let routeId = action.meta.routeId;
        let oldAddresses = state.addressesByRoute[routeId] || [];
        let addressIds = oldAddresses.concat(action.meta.addressIds);

        return Object.assign({}, state, {
            addressesByRoute: Object.assign({}, state.addressesByRoute, {
                [routeId]: addressIds,
            }),
        });
    }
    else if (action.type == types.REMOVE_ADDRESSES_FROM_ROUTE + '_FULFILLED') {
        let routeId = action.meta.routeId;
        let oldIds = state.addressesByRoute[routeId] || [];
        let addressIds = oldIds.filter(id => action.meta.addressIds.indexOf(id) < 0);

        return Object.assign({}, state, {
            addressesByRoute: Object.assign({}, state.addressesByRoute, {
                [routeId]: addressIds,
            }),
        });
    }
    else {
        return state || {
            addressList: null,
            addressesByRoute: {},
            streetList: createList(),
        };
    }
}
