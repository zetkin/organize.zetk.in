import Z from 'zetkin';

import * as types from './';


export function createPerson(data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_PERSON,
            payload: {
                promise: Z.resource('orgs', orgId, 'people').post(data)
            }
        });
    };
}

export function retrievePeople() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PEOPLE,
            payload: {
                promise: Z.resource('orgs', orgId, 'people').get()
            }
        });
    };
}

export function retrievePerson(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PERSON,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'people', id).get()
            }
        });
    };
}

export function updatePerson(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_PERSON,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', id).patch(data)
            }
        });
    };
}

export function deletePerson(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_PERSON,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'people', id).del()
            }
        });
    };
}
