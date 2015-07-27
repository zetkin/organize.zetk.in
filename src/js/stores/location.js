import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


export default class LocationStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            locations: []
        });

        var locationActions = flux.getActions('location');
        this.register(locationActions.retrieveLocations,
            this.onRetrieveLocationsComplete);
        this.register(locationActions.retrieveLocation,
            this.onRetrieveLocationComplete);
        this.register(locationActions.updateLocation,
            this.onUpdateLocationComplete);
    }

    getLocations() {
        return this.state.locations;
    }

    getLocation(id) {
        return this.state.locations.find(p => p.id == id);
    }

    onRetrieveLocationsComplete(res) {
        this.setState({
            locations: res.data.data
        });
    }

    onRetrieveLocationComplete(res) {
        var loc = res.data.data;

        StoreUtils.updateOrAdd(this.state.locations, loc.id, loc);

        this.setState({
            locations: this.state.locations
        });
    }

    onUpdateLocationComplete(res) {
        var loc = res.data.data;

        StoreUtils.updateOrAdd(this.state.locations, loc.id, loc);

        this.setState({
            locations: this.state.locations
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
