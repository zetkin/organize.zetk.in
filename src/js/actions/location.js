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

    updateLocation(locationId, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'locations', locationId).patch(data);
    }
    createLocation(data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'locations').post(data);
    }

    deleteLocation(locationId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'locations', locationId).del();
    }
    setPendingLatLng(loc) {
        return loc;
    }
    setPendingLocation(loc) {
        return loc;
    }
    clearPendingLocation() {
        return true;
    }
}
