import * as types from '.';


export function retrieveNotes(context, id) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        if (context == 'person') {
            dispatch({
                type: types.RETRIEVE_PERSON_NOTES,
                meta: { context, id },
                payload: {
                    promise: z.resource('orgs', orgId, 'people', id, 'notes').get(),
                },
            });
        }
    };
}

export function createNote(context, id, text) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        if (context == 'person') {
            dispatch({
                type: types.CREATE_PERSON_NOTE,
                meta: { context, id },
                payload: {
                    promise: z.resource('orgs', orgId, 'people', id, 'notes').post({ text }),
                },
            });
        }
    };
}
