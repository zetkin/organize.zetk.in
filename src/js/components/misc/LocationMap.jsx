import React from 'react/addons';


export default class LocationMap extends React.Component {
    componentDidMount() {
        var ctrDOMNode = React.findDOMNode(this.refs.mapContainer);
        var mapOptions = {
            // TODO: Derive center from something?
            center: { lat: 55.6, lng: 13.04 },
            disableDefaultUI: true,
            zoom: 11
        };

        this.map = new google.maps.Map(ctrDOMNode, mapOptions);
        this.markers = [];

        this.resetMarkers();
    }

    componentDidUpdate() {
        this.resetMarkers();
    }

    componentWillUnmount() {
        var marker;


        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }
    }

    render() {
        return (
            <div ref="mapContainer" style={ this.props.style }/>
        )
    }

    resetMarkers() {
        var i;
        var marker;
        var bounds = new google.maps.LatLngBounds();

        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        for (i in this.props.locations) {
            var loc = this.props.locations[i];
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

    onMarkerClick(marker, locationData) {
        if (this.props.onLocationSelect) {
            this.props.onLocationSelect(locationData);
        }
    }
}

LocationMap.propTypes = {
    locations: React.PropTypes.array,
    style: React.PropTypes.object
}
