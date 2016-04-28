import { Actions } from 'flummox';
import Z from 'zetkin';


export default class ReminderActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    sendAllActionReminders(actionId) {
        const orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', actionId, 'reminders')
                .meta('actionId', actionId).post();
    }
}
