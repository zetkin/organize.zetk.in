import { Actions } from 'flummox';
import Z from 'zetkin'


export default class ActivityActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveActivities() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'activities').get();
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(statestr);
    }
}
