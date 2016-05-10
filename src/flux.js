import Flummox from 'flummox';
import { Dispatcher } from 'flux';

import ReminderActions from './actions/reminder';


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

        this.createActions('reminder', ReminderActions, this);
    }
}
