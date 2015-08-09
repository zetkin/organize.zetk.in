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
        // TODO: create nicer looking svg path
        this.iconSettings =  {
               path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
               fillColor: 'red',
               fillOpacity: 1,
               strokeColor: '#000',
        }

        this.map = new google.maps.Map(ctrDOMNode, mapOptions);
        this.markers = [];

        this.resetMarkers(true);
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

    resetMarkers(setBounds) {
        var i;
        var marker;
        var bounds = new google.maps.LatLngBounds();

        var locations = this.props.locations;
        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        var pendingId;
        if (this.props.pendingLocation) {
            this.createMarker(this.props.pendingLocation, bounds, true);
            pendingId = this.props.pendingLocation.id;
        }

        for (i in locations) {
            if (pendingId !== locations[i].id) {
                this.createMarker(locations[i], bounds, false);
            }
        }

        // dont set new center if user moved the map
        if (setBounds) {
            this.map.setCenter(bounds.getCenter());
            this.map.setZoom(12); // TODO: Calculate this somehow
        }
    }
    createMarker(loc, bounds, editable) {
        var marker;
        var latLng = new google.maps.LatLng(loc.lat, loc.lng);

        marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            draggable: editable, 
            title: loc.title,
        });
        // if editable only drag the marker (all info already vibile)
        if (editable) {
            var iconSettings = this.iconSettings;
            iconSettings.fillColor = 'green';
            marker.setIcon(iconSettings);
            google.maps.event.addListener(marker, 'dragend', 
                    this.onMarkerDragEnd.bind(this, marker, loc));
        }
        else {
            google.maps.event.addListener(marker, 'click',
            this.onMarkerClick.bind(this, marker, loc));
        }

        bounds.extend(latLng);
        this.markers.push(marker);
    }
    onMarkerDragEnd (marker, locationData) {
        var pos = marker.getPosition();
        if (this.props.onLocationChange) {
            this.props.onLocationChange({
                id: this.props.pendingLocation.id,
                lat: pos.lat(),
                lng: pos.lng()
            });
        }
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
