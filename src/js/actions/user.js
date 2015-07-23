import { Actions } from 'flummox';
import Z from 'zetkin';


export default class UserActions extends Actions {
    getUserInfo() {
        return Z.resource('/users/me').get()
    }
}
