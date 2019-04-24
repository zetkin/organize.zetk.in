import * as types from '../actions';

export default function documents(state = null, action) {
    switch (action.type) {
        case types.INIT_PAYMENTS + '_PENDING':
            return Object.assign({}, state, {
                isLoading: true,
            });
        case types.INIT_PAYMENTS + '_FULFILLED':
            return Object.assign({}, state, {
                isLoading: false,
                isLoaded: true,
                config: action.payload.config,
                stripe: action.payload.stripe,
            });
        case types.INIT_PAYMENTS + '_REJECTED':
            return Object.assign({}, state, {
                loading: false,
            });

        default:
            return state || {
                isLoading: false,
                isLoaded: false,
                config: null,
                stripe: null,
            };
    }
};
