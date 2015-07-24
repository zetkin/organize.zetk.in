import Flummox from 'flummox';

import DashboardStore from './stores/dashboard';
import OrgStore from './stores/org';
import UserActions from './actions/user';
import UserStore from './stores/user';


export default class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);

        this.createStore('dashboard', DashboardStore, this);
        this.createStore('org', OrgStore, this);
        this.createStore('user', UserStore, this);
    }
}
