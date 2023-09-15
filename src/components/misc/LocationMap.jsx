import React from 'react';
import ReactDOM from 'react-dom';
import { getLocationAverage } from '../../utils/location';


export default class LocationMap extends React.Component {
    static propTypes = {
        pendingLocation: React.PropTypes.object,
        locations: React.PropTypes.array,
        locationsForBounds: React.PropTypes.array,
        style: React.PropTypes.object,
        zoom: React.PropTypes.number,
        onLocationChange: React.PropTypes.func,
    };

    componentDidMount() {
        let center;
        if (this.props.pendingLocation) {
            center = [this.props.pendingLocation.lat, this.props.pendingLocation.lng];
        }
        var mapOptions = {
            center: center,
            disableDefaultUI: true,
            zoomControl: false, // We're setting zoom control with custom location later
            zoom: this.props.zoom || 4,
        };

        this.centerSetFromData = false;
        this.map = L.map('mapContainer', mapOptions).addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
        if (this.props.onMapClick) {
            this.map.on('click', this.onMapClick);
        }
        this.markers = [];

        this.resetMarkers();
    }

    componentDidUpdate(prevProps) {
        if (this.props.locations != prevProps.locations) {
            this.resetMarkers();
        }
    }

    componentWillUnmount() {
        var marker;
        // Remove old markers
        while (marker = this.markers.pop()) {
            this.map.removeLayer(marker);
        }
    }

    render() {
        return (
            <div className="LocationMap"
                id="mapContainer" style={ this.props.style }/>
        )
    }

    resetMarkers() {
        var i;
        var marker;

        var locations = this.props.locations;
        // Remove old markers
        while (marker = this.markers.pop()) {
            this.map.removeLayer(marker);
        }

        var pendingId;
        if (this.props.pendingLocation) {
            this.createMarker({data: this.props.pendingLocation}, true);
            pendingId = this.props.pendingLocation.id;

            const loc = L.LatLng(this.props.pendingLocation.lat, this.props.pendingLocation.lng);
            const zoom = this.props.zoom || 16;
            //this.map.setView(loc, zoom);
            this.centerSetFromData = true;
        }

        if (locations) {
            for (i = 0; i < locations.length; i++) {
                if (pendingId !== locations[i].data.id) {
                    this.createMarker(locations[i], false);
                }
            }
        }
        // Use special locations for calculating bounds
        // right now just an extra loop...
        // and and only center and set bounds if map not centered by
        // data before
        if (!this.centerSetFromData && this.props.locationsForBounds) {
            if (this.props.locationsForBounds.length > 0) {
                this.centerSetFromData = true;
                this.positionMap(this.props.locationsForBounds);
            }
        }
    }

    positionMap(locations) {
        var i;
        var bounds = [];
        // create Bounds and  loop through locations and 
        for (i = 0; i < locations.length; i++) {
            var latLng = [locations[i].data.lat, locations[i].data.lng];
            bounds.push(latLng)
        }
        const latLngBounds = L.latLngBounds(bounds);
        this.map.fitBounds(latLngBounds);

        if (this.map.getZoom() > 15) {
            this.map.setZoom(15);
        }
    }

    createMarker(loc, editable) {
        const marker = L.marker([loc.data.lat, loc.data.lng], { 
            title: loc.data.title, 
            draggable: editable,
            autoPan: editable}
        ).addTo(this.map);

        // If editable only drag the marker (all info already vibile)
        if (editable) {
            marker.on('move', (event) => {
                const pos = event.latlng;
                if (this.props.onLocationChange) {
                    this.props.onLocationChange({
                        id: this.props.pendingLocation.id,
                        lat: pos.lat,
                        lng: pos.lng,
                    });
                }
            })
        }
        else {
            marker.on('click', () => {
                if (this.props.onLocationSelect) {
                    this.props.onLocationSelect(loc);
                }
            });
        }

        this.markers.push(marker);
    }
}
