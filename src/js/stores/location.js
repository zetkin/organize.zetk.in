import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


export default class LocationStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            locations: [],
            inEditMode: false,
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
        this.register(locationActions.setPendingLatLng,
            this.onSetPendingLatLngComplete);
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

    onSetPendingLatLngComplete(loc) {
        var pendingLocation = this.state.pendingLocation;
        pendingLocation.lat = loc.lat;
        pendingLocation.lng = loc.lng;
        this.setState({
            pendingLocation: pendingLocation
        });
    }
    onSetPendingLocationComplete(loc) {
        this.setState({
            inEditMode: loc.editable || false,
            pendingLocation: {
                editable: loc.editable || false,
                lat : loc.lat,
                lng : loc.lng
            }
        });
    }
    onClearPendingLocationComplete() {
        this.setState({
            inEditMode: false,
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
