import { Actions } from 'flummox';
import Z from 'zetkin';


export default class UserActions extends Actions {
    getUserInfo() {
        return Z.resource('/users/me').get()
    }

    getUserMemberships() {
        return Z.resource('/users/me/memberships').get()
    }

    setActiveMembership(membership) {
        return membership;
    }
}
