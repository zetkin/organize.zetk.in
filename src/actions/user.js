import Z from 'zetkin';
import * as types from '.';


export function getUserInfo() {
    return {
        type: types.GET_USER_INFO,
        payload: {
            promise: Z.resource('/users/me').get(),
        }
    };
}

export function getUserMemberships() {
    return {
        type: types.GET_USER_MEMBERSHIPS,
        payload: {
            promise: Z.resource('/users/me/memberships').get(),
        }
    };
}

export function setActiveMembership(membership) {
    return {
        type: types.SET_ACTIVE_MEMBERSHIP,
        payload: { membership },
    };
}
