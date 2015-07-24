import { Actions } from 'flummox';
import Z from 'zetkin';


export default class PersonActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    getPeople() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'people').get();
    }

    getPerson(personId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'people', personId).get();
    }
}
