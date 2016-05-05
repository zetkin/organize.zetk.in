import Flummox from 'flummox';
import { Dispatcher } from 'flux';

import ActionActions from './actions/action';
import ActionStore from './stores/action';
import ActivityActions from './actions/activity';
import ActivityStore from './stores/activity';
import CampaignActions from './actions/campaign';
import CampaignStore from './stores/campaign';
import DashboardActions from './actions/dashboard';
import DashboardStore from './stores/dashboard';
import OrgStore from './stores/org';
import ParticipantActions from './actions/participant';
import ParticipantStore from './stores/participant';
import QueryActions from './actions/query';
import QueryStore from './stores/query';
import ReminderActions from './actions/reminder';
import SearchActions from './actions/search';
import SearchStore from './stores/search';
import UserActions from './actions/user';
import UserStore from './stores/user';


export default class QueuedDispatcher extends Dispatcher {
    constructor() {
        super();

        this.payloads = [];
    }

    dispatch(payload) {
        if (!this.isDispatching()) {
            super.dispatch(payload);
            this.dispatchQueue();
        }
        else {
            this.addToQueue(payload);
        }
    }

    addToQueue(payload) {
        this.payloads.push(payload);
    }

    dispatchQueue() {
        if (!this.payloads.length) {
            return false;
        }

        this.dispatch(this.payloads.shift());
    }
}


export default class Flux extends Flummox {
    constructor() {
        super();

        this.dispatcher = new QueuedDispatcher();

        this.createActions('action', ActionActions, this);
        this.createActions('activity', ActivityActions, this);
        this.createActions('campaign', CampaignActions, this);
        this.createActions('dashboard', DashboardActions);
        this.createActions('participant', ParticipantActions, this);
        this.createActions('query', QueryActions);
        this.createActions('reminder', ReminderActions, this);
        this.createActions('search', SearchActions);
        this.createActions('user', UserActions);

        this.createStore('action', ActionStore, this);
        this.createStore('activity', ActivityStore, this);
        this.createStore('campaign', CampaignStore, this);
        this.createStore('dashboard', DashboardStore, this);
        this.createStore('org', OrgStore, this);
        this.createStore('participant', ParticipantStore, this);
        this.createStore('query', QueryStore, this);
        this.createStore('search', SearchStore, this);
        this.createStore('user', UserStore, this);
    }
}
