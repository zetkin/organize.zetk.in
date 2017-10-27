import * as types from '.';


export function retrieveHouseholdVisits(arId = null) {
    return ({ dispatch, getState, z }) => {
        let promise;
        let orgId = getState().org.activeId;

        if (arId) {
            promise = z.resource('orgs', orgId,
                'assigned_routes', arId, 'household_visits').get();
        }
        else {
            promise = z.resource('orgs', orgId, 'household_visits').get();
        }

        dispatch({
            type: types.RETRIEVE_HOUSEHOLD_VISITS,
            meta: { arId },
            payload: { promise },
        });
    };
}
