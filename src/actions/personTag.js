import Z from 'zetkin';

import * as types from '.';


export function retrievePersonTags() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_TAGS,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'tags').get(),
            }
        });
    };
}
