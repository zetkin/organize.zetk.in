import * as types from '.';


export function getUserInfo() {
    return ({ dispatch, z }) => {
        dispatch({
            type: types.GET_USER_INFO,
            payload: {
                promise: z.resource('/users/me').get(),
            }
        });
    }
}

export function getUserMemberships() {
    return ({ dispatch, z }) => {
        dispatch({
            type: types.GET_USER_MEMBERSHIPS,
            payload: {
                promise: z.resource('/users/me/memberships').get(),
            }
        });
    }
}

export function setActiveMembership(membership) {
    return {
        type: types.SET_ACTIVE_MEMBERSHIP,
        payload: { membership },
    };
}
