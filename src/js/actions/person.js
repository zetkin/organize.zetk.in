import { Actions } from 'flummox';
import Z from 'zetkin';


export default class PersonActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrievePeople() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'people').get();
    }

    retrievePerson(personId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'people', personId).get();
    }

    updatePerson(personId, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'people', personId).patch(data);
    }
}
