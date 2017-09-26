import React from 'react';

export default class AddressMap extends React.Component {
    render() {
        return (
            <div className="AddressMap">
                <div className="AddressMap-map" ref="map"/>
            </div>
        );
    }

    componentDidMount() {
        var mapOptions = {
            center: new google.maps.LatLng(55.61, 13.01),
            disableDefaultUI: true,
            zoomControl: true,
            zoom: 13,
        };

        this.defaultIcon =  {
               url: '/static/images/address-marker-black.png',
               scaledSize: { width: 6, height: 6 },
               anchor: { x: 3, y: 3 },
        };

        this.activeIcon =  {
               url: '/static/images/address-marker-red.png',
               scaledSize: { width: 6, height: 6 },
               anchor: { x: 3, y: 3 },
        };

        this.centerSetFromData = false;
        this.map = new google.maps.Map(this.refs.map, mapOptions);

        this.markers = [];
        this.resetMarkers();
    }

    componentDidUpdate(prevProps) {
        if (this.props.addresses != prevProps.addresses) {
            this.resetMarkers();
        }

        if (this.props.highlightRoute != prevProps.highlightRoute) {
            this.redrawMarkers();
        }
    }

    resetMarkers() {
        let marker;
        let addressList = this.props.addressList;

        // Remove existing markers
        while (marker = this.markers.pop()) {
            marker.marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker.marker);
        }

        if (this.props.addresses) {
            let addresses = this.props.addresses

            addresses.forEach(addr => {
                let latLng = new google.maps.LatLng(addr.latitude, addr.longitude);

                marker = new google.maps.Marker({
                    icon: this.defaultIcon,
                    position: latLng,
                    map: this.map,
                    title: addr.title,
                    zIndex: 0,
                });

                marker.addListener('click', this.onMarkerClick.bind(this, addr));

                this.markers.push({
                    marker, addr
                });
            });

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
    }

    redrawMarkers() {
        let activeIds = this.props.highlightRoute?
            this.props.highlightRoute.addresses : null;

        this.markers.forEach(m => {
            let isActive = (activeIds && activeIds.indexOf(m.addr.id) >= 0);
            let curIcon = m.marker.getIcon();
            if (isActive && curIcon.url == this.defaultIcon.url) {
                m.marker.setIcon(this.activeIcon);
                m.marker.setZIndex(1);
            }
            else if (!isActive && curIcon.url == this.activeIcon.url) {
                m.marker.setIcon(this.defaultIcon);
                m.marker.setZIndex(0);
            }
        });
    }

    onMarkerClick(addr) {
        if (this.props.onAddressClick) {
            this.props.onAddressClick(addr);
        }
    }
}
