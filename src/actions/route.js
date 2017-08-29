import * as types from '.';

export function generateRoutes(addressIds, config = {}) {
    let routeSize = config.routeSize || 30;
    let routes = [];

    return ({ dispatch, getState }) => {
        let addresses = addressIds
            .map(id => getState().addresses.addressList.items
                .find(i => i.data.id == id));

        // TODO: Implement auto-planner algorithm

        addresses.forEach(addr => {
            let route = routes.length? routes[routes.length - 1] : null;

            if (!route || route.addresses.length >= routeSize) {
                routes.push(route = {
                    id: routes.length + 1,
                    addresses: [],
                });
            }

            route.addresses.push(addr);
        });

        dispatch({
            type: types.GENERATE_ROUTES + '_COMPLETE',
            meta: {
                config: {
                    routeSize,
                },
            },
            data: {
                routes
            }
        });
    };
}
