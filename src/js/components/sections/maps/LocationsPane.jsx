import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import LocationMap from '../../misc/LocationMap';


export default class LocationsPane extends PaneBase {
    getPaneTitle() {
        return 'Locations';
    }

    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
        this.getActions('location').retrieveLocations();
    }

    renderPaneContent() {
        var locationStore = this.getStore('location');
        var locations = locationStore.getLocations();

        var style = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        return (
            <LocationMap style={ style} locations={ locations }
                onLocationSelect={ this.onLocationSelect.bind(this) }/>
        );
    }

    onLocationSelect(loc) {
        this.gotoSubPane('location', loc.id);
    }
}
