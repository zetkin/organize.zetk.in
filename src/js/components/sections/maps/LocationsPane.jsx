import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


export default class LocationsPane extends PaneBase {
    getPaneTitle() {
        return 'Locations';
    }

    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
        this.getActions('location').retrieveLocations();
    }

    renderPaneContent() {
        return (
            <div ref="mapContainer"/>
        );
    }
}
