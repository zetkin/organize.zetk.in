import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { stringFromAddress } from '../../../../utils/location';
import {
    addToSelection,
    removeFromSelection,
} from '../../../../actions/selection';

const MARKER_SIZE = 8;
const MARKER_OFFS = MARKER_SIZE/2;


@connect(state => ({}))
export default class AddressMap extends React.Component {
    render() {
        let classes = cx('AddressMap', {
            'browseMode': this.props.mode == 'browse',
            'selectMode': this.props.mode == 'select',
        });

        return (
            <div className={ classes }>
                <div className="AddressMap-map" id="mapContainer"/>
            </div>
        );
    }

    componentDidMount() {
        var mapOptions = {
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: false,
            zoom: 13,
            boxZoom: false,
        };

        this.defaultIcon = L.icon({
            iconUrl: '/static/images/address-marker-black.png',
            iconSize: [ MARKER_SIZE, MARKER_SIZE ],
            iconAnchor: [ MARKER_OFFS,  MARKER_OFFS ],
        });

        this.activeIcon = L.icon({
            iconUrl: '/static/images/address-marker-red.png',
            iconSize: [ MARKER_SIZE, MARKER_SIZE ],
            iconAnchor: [ MARKER_OFFS, MARKER_OFFS ],
        });

        this.selectedIcon = L.icon({
            iconUrl: '/static/images/address-marker-blue.png',
            scaledSize: [ MARKER_SIZE, MARKER_SIZE ],
            anchor: [ MARKER_OFFS, MARKER_OFFS ],
        });

        this.centerSetFromData = false;
        this.map = L.map('mapContainer', mapOptions).addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        this.markers = [];
        this.resetMarkers();

        if (this.markers.length) {
            let bounds = [];
            this.markers.forEach(m => {
                const loc = m.marker.getLatLng()
                bounds.push([loc.lat, loc.lng]);
            });
            this.map.fitBounds(bounds);
        }

        this.map.on('mousedown', this.onMapMouseDown.bind(this));

        window.addEventListener('keydown', this.onKeyDown = this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp = this.onKeyUp.bind(this));

        this.resetDragState();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    componentDidUpdate(prevProps) {
        if (this.props.addresses != prevProps.addresses) {
            this.resetMarkers();
        }

        if (this.props.highlightAddresses != prevProps.highlightAddresses) {
            this.redrawMarkers();
        }

        if (this.props.selection != prevProps.selection) {
            this.redrawMarkers();
        }

        if (this.props.mode != prevProps.mode) {
            this.resetDragState();
        }
    }

    resetMarkers() {
        let marker;
        let addressList = this.props.addressList;

        // Remove existing markers
        while (marker = this.markers.pop()) {
            marker.marker.off()
            marker.marker.remove();
        }

        if (this.props.addresses) {
            let addresses = this.props.addresses;
            let selection = this.props.selection;

            addresses.forEach(addr => {
                let latLng = L.latLng(addr.latitude, addr.longitude);
                let icon = this.defaultIcon;

                if (selection && selection.selectedIds.indexOf(addr.id) >= 0) {
                    icon = this.selectedIcon;
                }

                marker = L.marker(latLng, {
                    title: stringFromAddress(addr),
                    zIndex: 0,
                    icon: icon,
                }).addTo(this.map);

                marker.on('click', this.onMarkerClick.bind(this, addr));

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
        let activeIds = this.props.highlightAddresses;

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

            if (curIcon.options.iconUrl != nextIcon.options.iconUrl) {
                m.marker.setIcon(nextIcon);
                m.marker.setZIndexOffset(zIndex);
            }
        });
    }

    onMarkerClick(addr) {
        if (this.props.mode == 'browse' && this.props.onAddressClick) {
            this.props.onAddressClick(addr);
        }
        else if (this.props.mode == 'select') {
            if (this.mapDragMode == 'selecting' && this.selectionRect) {
                // If dragging, handle this as a normal mouse up event
                this.onMapMouseUp();
                return;
            }

            let selection = this.props.selection;

            if (selection.selectedIds.indexOf(addr.id) >= 0) {
                this.props.dispatch(removeFromSelection(selection.id, addr.id));
            }
            else {
                this.props.dispatch(addToSelection(selection.id, addr.id));
            }
        }
    }

    onMapMouseDown(ev) {
        if (this.props.mode == 'select') {
            if (this.spaceIsDown) {
                this.mapDragMode = 'panning';
            }
            else {
                this.mapDragMode = 'selecting';
                this.mouseDownPos = ev.latlng;

                L.setOptions(this.map, {
                    draggable: false,
                    draggableCursor: 'crosshair',
                });

                this.map.on('mousemove', this.onMapMouseMove.bind(this));
            }

            this.map.on('mouseup', this.onMapMouseUp.bind(this));
        }
    }

    onMapMouseMove(ev) {
        let bounds = L.latLngBounds(this.mouseDownPos, this.mouseDownPos);

        bounds.extend(ev.latlng);
        if (this.selectionRect) {
            this.selectionRect.setBounds(bounds);
        }
        else {
            this.selectionRect = L.rectangle(bounds, {
                weight: 1,
                color: 'red',
            }).addTo(this.map);
        }
    }

    onMapMouseUp(ev) {
        // Find selection
        if (this.mapDragMode == 'selecting' && this.selectionRect) {
            let bounds = this.selectionRect.getBounds();
            let selection = this.props.selection;
            let markers = this.markers
                .filter(m => bounds.contains(m.marker.getLatLng()));

            if (this.altIsDown) {
                markers
                    .filter(m => selection.selectedIds.indexOf(m.addr.id) >= 0)
                    .forEach(m => {
                        let addrId = m.addr.id;
                        this.props.dispatch(removeFromSelection(selection.id, addrId));
                    });
            }
            else {
                markers
                    .forEach(m => {
                        let addrId = m.addr.id;
                        this.props.dispatch(addToSelection(selection.id, addrId));
                    });
            }

            // Clean up
            this.mouseDownPos = null;
            this.selectionRect.remove();
        }

        this.mapDragMode = null;
        this.selectionRect = null;
        this.resetDragState();

        this.map.off('mousemove');
        this.map.off('mouseup');
    }

    onKeyDown(ev) {
        if (ev.keyCode == 32) { // Space
            this.spaceIsDown = true;
        }
        else if (ev.keyCode == 18) { // Alt
            this.altIsDown = true;
        }

        this.resetDragState();
    }

    onKeyUp(ev) {
        if (ev.keyCode == 32) { // Space
            this.spaceIsDown = false;
        }
        else if (ev.keyCode == 18) { // Alt
            this.altIsDown = false;
        }

        this.resetDragState();
    }

    resetDragState() {
        let draggable = (this.props.mode == 'browse')
            || (this.mapDragMode == 'panning')
            || !!this.spaceIsDown;

        if(draggable) {
            this.map.dragging.enable();
        } else {
            this.map.dragging.disable();
        }

        L.setOptions(this.map, {
            scrollwheel: true,
            draggableCursor: draggable? 'grab' : 'crosshair',
        });
    }
}
