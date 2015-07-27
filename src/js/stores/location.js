import { Store } from 'flummox';


export default class LocationStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            locations: []
        });

        var locationActions = flux.getActions('location');
        this.register(locationActions.retrieveLocations,
            this.onRetrieveLocationsComplete);
    }

    getLocations() {
        return this.state.locations;
    }

    onRetrieveLocationsComplete(res) {
        this.setState({
            locations: res.data.data
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
