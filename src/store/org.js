import * as types from '../actions';


export default function org(state = null, action) {
    // TODO: Remove this store and just use user store?
    switch (action.type) {
        case types.GET_USER_MEMBERSHIPS + '_FULFILLED':
            // Add only active memberships
            let officialMemberships = action.payload.data.data.filter(m => 
                (m.role != null));

            return Object.assign({}, state, {
                activeId: officialMemberships[0].organization.id,
            });

        case types.SET_ACTIVE_MEMBERSHIP:
            console.log('NEW MEMBERSHIP', action.payload.membership.organization.id);
            return Object.assign({}, state, {
                activeId: action.payload.membership.organization.id,
            });

        default:
            return state || {
                activeId: null,
            };
    }
}
