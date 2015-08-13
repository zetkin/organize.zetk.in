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
        if (this.props.onMapClick) {
            google.maps.event.addListener(this.map, 'click', this.onMapClick.bind(this));
        }
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

    

    resetMarkers(getBounds) {
        var i;
        var marker;
        var bounds;

        var locations = this.props.locations;
        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        var pendingId;
        if (this.props.pendingLocation) {
            this.createMarker(this.props.pendingLocation, true);
            pendingId = this.props.pendingLocation.id;
        }

        for (i in locations) {
            if (pendingId !== locations[i].id) {
                this.createMarker(locations[i], false, bounds);
            }
        }
        // Use special locations for calculating bounds
        // right now just an extra loop...
        if (getBounds && this.props.locationsForBounds) {
            this.positionateMap(this.props.locationsForBounds);
        }
    }

    positionateMap (locations) {
        var i;
        var bounds = new google.maps.LatLngBounds();
        // create Bounds and  loop through locations and 
        for (i in locations) {
            var latLng = new google.maps.LatLng(locations[i].lat, locations[i].lng);
            bounds.extend(latLng);
        }
        this.map.setCenter(bounds.getCenter());
        this.map.fitBounds(bounds);
    }

    createMarker(loc, editable, bounds) {
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
    
    onMapClick(ev) {
        var position = ev.latLng;
        if (this.props.onMapClick) {
            this.props.onMapClick({
                lat: position.lat(),
                lng: position.lng()
            });
        }

    }
}

LocationMap.propTypes = {
    locations: React.PropTypes.array,
    style: React.PropTypes.object
}
