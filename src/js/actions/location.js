import { Actions } from 'flummox';
import Z from 'zetkin';


export default class LocationActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveLocations() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'locations').get();
    }

    retrieveLocation(locationId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'locations', locationId).get();
    }
}
