import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import {
    addToSelection,
    removeFromSelection,
} from '../../../../actions/selection';


@connect(state => ({}))
export default class AddressMap extends React.Component {
    render() {
        let classes = cx('AddressMap', {
            'browseMode': this.props.mode == 'browse',
            'selectMode': this.props.mode == 'select',
        });

        return (
            <div className={ classes }>
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

        this.defaultIcon = {
            url: '/static/images/address-marker-black.png',
            scaledSize: { width: 6, height: 6 },
            anchor: { x: 3, y: 3 },
        };

        this.activeIcon = {
            url: '/static/images/address-marker-red.png',
            scaledSize: { width: 6, height: 6 },
            anchor: { x: 3, y: 3 },
        };

        this.selectedIcon = {
            url: '/static/images/address-marker-blue.png',
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

        if (this.props.selection != prevProps.selection) {
            this.redrawMarkers();
        }

        if (this.props.mode != prevProps.mode) {
            if (this.props.mode == 'select') {
                this.map.setOptions({
                    draggable: false,
                    draggableCursor: 'crosshair',
                });
            }
            else {
                this.map.setOptions({
                    draggable: true,
                    draggableCursor: 'default',
                });
            }
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
            let curIcon = m.marker.getIcon();
            let nextIcon = this.defaultIcon;
            let zIndex = 0;

            let selection = this.props.selection;
            if (activeIds && activeIds.indexOf(m.addr.id) >= 0) {
                nextIcon = this.activeIcon;
                zIndex = 1;
            }
            else if (selection && selection.selectedIds.indexOf(m.addr.id) >= 0) {
                nextIcon = this.selectedIcon;
                zIndex = 2;
            }

            if (curIcon.url != nextIcon.url) {
                m.marker.setIcon(nextIcon);
                m.marker.setZIndex(zIndex);
            }
        });
    }

    onMarkerClick(addr) {
        if (this.props.mode == 'browse' && this.props.onAddressClick) {
            this.props.onAddressClick(addr);
        }
        else if (this.props.mode == 'select') {
            let selection = this.props.selection;

            console.log(addr.id, selection.selectedIds);
            if (selection.selectedIds.indexOf(addr.id) >= 0) {
                this.props.dispatch(removeFromSelection(selection.id, addr.id));
            }
            else {
                this.props.dispatch(addToSelection(selection.id, addr.id));
            }
        }
    }
}
