import * as types from '.';


export function retrieveAddresses() {
    // TODO: Load async
    return {
        type: types.RETRIEVE_ADDRESSES,
        payload: {
            promise: fetch('/static/images/dummy-addresses.json')
                .then(res => {
                    return res.json();
                })
        }
    };
}
