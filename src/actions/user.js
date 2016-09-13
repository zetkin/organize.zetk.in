import * as types from '.';


export function getUserInfo() {
    return ({ dispatch, z }) => {
        let action = {
            type: types.GET_USER_INFO,
            payload: {
                promise: z.resource('/users/me').get(),
            }
        };

        dispatch(action);

        return action;
    }
}

export function getUserMemberships() {
    return ({ dispatch, z }) => {
        let action = {
            type: types.GET_USER_MEMBERSHIPS,
            payload: {
                promise: z.resource('/users/me/memberships').get(),
            }
        };

        dispatch(action);

        return action;
    }
}

export function setActiveMembership(membership) {
    return {
        type: types.SET_ACTIVE_MEMBERSHIP,
        payload: { membership },
    };
}
