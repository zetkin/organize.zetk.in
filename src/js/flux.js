import Flummox from 'flummox';

import ActionActions from './actions/action';
import ActionStore from './stores/action';
import CampaignActions from './actions/campaign';
import CampaignStore from './stores/campaign';
import DashboardStore from './stores/dashboard';
import LocationActions from './actions/location';
import LocationStore from './stores/location';
import OrgStore from './stores/org';
import PersonActions from './actions/person';
import PersonStore from './stores/person';
import SearchActions from './actions/search';
import SearchStore from './stores/search';
import UserActions from './actions/user';
import UserStore from './stores/user';


export default class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('action', ActionActions, this);
        this.createActions('campaign', CampaignActions, this);
        this.createActions('location', LocationActions, this);
        this.createActions('person', PersonActions, this);
        this.createActions('search', SearchActions);
        this.createActions('user', UserActions);

        this.createStore('action', ActionStore, this);
        this.createStore('campaign', CampaignStore, this);
        this.createStore('dashboard', DashboardStore, this);
        this.createStore('location', LocationStore, this);
        this.createStore('org', OrgStore, this);
        this.createStore('person', PersonStore, this);
        this.createStore('search', SearchStore, this);
        this.createStore('user', UserStore, this);
    }
}
