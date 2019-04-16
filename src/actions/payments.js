import * as types from '.';

export function initPayments() {
    return ({ dispatch, getState, z }) => {
        const state = getState().payments;

        if (state.loading || state.loaded) {
            return;
        }

        dispatch({
            type: types.INIT_PAYMENTS,
            payload: {
                promise: Promise
                    .all([
                        new Promise((resolve, reject) => {
                            if (window.Stripe) {
                                resolve();
                                return;
                            }

                            const script = document.createElement('script');
                            script.src = 'https://js.stripe.com/v3/';
                            script.async = true;
                            script.onload = resolve;
                            script.onerror =reject;

                            document.body.appendChild(script);
                        }),
                        z.resource('payments', 'client_config').get()
                    ])
                    .then(([event, config]) => ({
                        config: config.data.data,
                        stripe: window.Stripe(config.data.data.stripe.publishableKey),
                    })),
            }
        });
    };
}
