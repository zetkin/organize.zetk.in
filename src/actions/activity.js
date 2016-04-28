import { Actions } from 'flummox';
import Z from 'zetkin'


export default class ActivityActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    createActivity(data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'activities').post(data);
    }

    retrieveActivities() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'activities').get();
    }

    updateActivity(id, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'activities', id).patch(data);
    }

    deleteActivity(id) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'activities', id).del();
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(statestr);
    }
}
