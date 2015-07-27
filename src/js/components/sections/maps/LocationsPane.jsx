import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


export default class LocationsPane extends PaneBase {
    getPaneTitle() {
        return 'Locations';
    }

    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
        this.getActions('location').retrieveLocations();

        var ctrDOMNode = React.findDOMNode(this.refs.mapContainer);
        var mapOptions = {
            // TODO: Derive center from something?
            center: { lat: 55.6, lng: 13.04 },
            zoom: 11
        };

        this.map = new google.maps.Map(ctrDOMNode, mapOptions);
    }

    renderPaneContent() {
        var style = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        return (
            <div ref="mapContainer" style={ style }/>
        );
    }
}
