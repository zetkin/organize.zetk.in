import * as types from '.';


export function retrieveHouseholdVisits() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_HOUSEHOLD_VISITS,
            payload: {
                promise: z.resource('orgs', orgId, 'household_visits').get(),
            },
        });
    };
}
