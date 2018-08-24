import * as types from '.';


export function retrievePersonTimeline(personId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TIMELINE,
            meta: { personId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', personId, 'timeline').get(),
            },
        });
    };
}
