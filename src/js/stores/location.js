import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


export default class LocationStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            locations: [],
            pendingLocation: false,
        });

        var locationActions = flux.getActions('location');
        this.register(locationActions.retrieveLocations,
            this.onRetrieveLocationsComplete);
        this.register(locationActions.retrieveLocation,
            this.onRetrieveLocationComplete);
        this.register(locationActions.updateLocation,
            this.onUpdateLocationComplete);
        this.register(locationActions.createLocation,
            this.onCreateLocationComplete);
        this.register(locationActions.setPendingLocation,
            this.onSetPendingLocationComplete);
        this.register(locationActions.clearPendingLocation,
            this.onClearPendingLocationComplete);
        this.registerAsync(locationActions.deleteLocation,
            this.onDeleteLocationBegin, null);
    }

    getLocations() {
        return this.state.locations;
    }

    getLocation(id) {
        return this.state.locations.find(p => p.id == id);
    }

    getAverageCenterOfLocations() {
        var sumOfLat = 0;
        var sumOfLng = 0;
        this.state.locations.forEach(function(location) {
            sumOfLng += location.lng;
            sumOfLat += location.lat;
        });
        return {
            lat :  sumOfLat/this.state.locations.length,
            lng :  sumOfLng/this.state.locations.length
        }
    }

    getPendingLocation() {
        return this.state.pendingLocation;
    }
    getEditState() {
        return this.state.inEditMode;
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

    onDeleteLocationBegin(locationId) {
        StoreUtils.remove(this.state.locations, locationId);
        this.setState({
            locations: this.state.locations
        });
    }

    
    onCreateLocationComplete(res) {
        this.state.locations.push(res.data.data);
        this.setState({
            locations: this.state.locations
        });
    }

    onSetPendingLocationComplete(loc) {
        var newLoc = {
            lat: loc.lat,
            lng: loc.lng,
            id: loc.id
        }
        this.setState({
            pendingLocation: newLoc
        });
    }
    onClearPendingLocationComplete() {
        this.setState({
            pendingLocation: false
        })
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
