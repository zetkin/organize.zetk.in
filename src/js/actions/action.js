import { Actions } from 'flummox';
import Z from 'zetkin';


export default class ActionActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveAllActions() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions').get();
    }

    retrieveAction(id) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', id).get();
    }

    updateAction(id, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', id).patch(data);
    }
}
