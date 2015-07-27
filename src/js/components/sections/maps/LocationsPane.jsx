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
        this.markers = [];
    }

    componentDidUpdate() {
        var i;
        var marker;
        var locationStore = this.getStore('location');
        var locations = locationStore.getLocations();
        var bounds = new google.maps.LatLngBounds();

        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        for (i in locations) {
            var loc = locations[i];
            var latLng = new google.maps.LatLng(loc.lat, loc.lng);

            marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: loc.title
            });

            google.maps.event.addListener(marker, 'click',
                this.onMarkerClick.bind(this, marker, loc));

            bounds.extend(latLng);
            this.markers.push(marker);
        }

        this.map.setCenter(bounds.getCenter());
        this.map.setZoom(12); // TODO: Calculate this somehow
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

    onMarkerClick(marker, locationData) {
        this.gotoSubPane('location', locationData.id);
    }
}
