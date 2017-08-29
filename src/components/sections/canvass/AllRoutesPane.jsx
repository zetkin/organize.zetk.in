import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import SelectInput from '../../forms/inputs/SelectInput';
import { retrieveAddresses } from '../../../actions/address';
import { getLocationAverage } from '../../../utils/location';


const mapStateToProps = state => ({
    addressList: state.addresses.addressList,
});

@connect(mapStateToProps)
export default class AllRoutesPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveAddresses());

        var mapOptions = {
            center: getLocationAverage({}),
            disableDefaultUI: true,
            zoomControl: true,
            zoom: this.props.zoom || 4,
        };

        // TODO: create nicer looking svg path
        this.iconSettings =  {
               path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
               fillColor: '#ee323e',
               fillOpacity: 1,
               strokeColor: '#ac0e18',
        }

        this.centerSetFromData = false;
        this.map = new google.maps.Map(this.refs.map, mapOptions);

        this.markers = [];
        this.resetMarkers();
    }

    componentDidUpdate(prevProps) {
        if (this.props.addressList != prevProps.addressList) {
            this.resetMarkers();
        }
    }

    getRenderData() {
        return {
            addressList: this.props.addressList,
        };
    }

    renderPaneContent(data) {
        return [
            <div key="map" ref="map"
                className="AllRoutesPane-map">
            </div>
        ];
    }

    resetMarkers() {
        let marker;
        let addressList = this.props.addressList;

        // Remove existing markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        if (addressList.items && !addressList.isPending) {
            let addresses = this.props.addressList.items.map(i => i.data);

            addresses.forEach(addr => {
                let latLng = new google.maps.LatLng(addr.latitude, addr.longitude);

                marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    title: addr.address,
                });

                this.markers.push(marker);
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
}
