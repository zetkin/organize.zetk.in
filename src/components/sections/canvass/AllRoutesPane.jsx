import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import RoutePanel from './elements/RoutePanel';
import SelectInput from '../../forms/inputs/SelectInput';
import { retrieveAddresses } from '../../../actions/address';
import { generateRoutes, discardRouteDrafts } from '../../../actions/route';
import { getLocationAverage } from '../../../utils/location';


const mapStateToProps = state => ({
    addressList: state.addresses.addressList,
    generator: state.routes.generator,
    routeList: state.routes.routeList,
    draftList: state.routes.draftList,
});

@connect(mapStateToProps)
export default class AllRoutesPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveAddresses());

        var mapOptions = {
            center: new google.maps.LatLng(55.61, 13.01),
            disableDefaultUI: true,
            zoomControl: true,
            zoom: 13,
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
            </div>,
            <RoutePanel key="routes"
                generator={ this.props.generator }
                addressList={ this.props.addressList }
                routeList={ this.props.routeList }
                draftList={ this.props.draftList }
                onGenerate={ this.onRoutePanelGenerate.bind(this) }
                onDiscardDrafts={ this.onRoutePanelDiscard.bind(this) }
                onRouteMouseOver={ this.onRoutePanelRouteMouseOver.bind(this) }
                onRouteMouseOut={ this.onRoutePanelRouteMouseOut.bind(this) }
                />
        ];
    }

    resetMarkers(activeIds = null) {
        let marker;
        let addressList = this.props.addressList;

        // Remove existing markers
        while (marker = this.markers.pop()) {
            marker.marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker.marker);
        }

        if (addressList.items && !addressList.isPending) {
            let addresses = this.props.addressList.items.map(i => i.data);

            if (activeIds) {
                addresses = addresses
                    .filter(addr => activeIds.indexOf(addr.id) >= 0);
            }

            addresses.forEach(addr => {
                let latLng = new google.maps.LatLng(addr.latitude, addr.longitude);

                marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    title: addr.title,
                });

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

    redrawMarkers(activeIds = null) {
        this.markers.forEach(m => {
            let visible = !activeIds || !!activeIds.find(id => id == m.addr.id);
            m.marker.setVisible(visible);
        });
    }

    onRoutePanelGenerate(addresses, config) {
        this.props.dispatch(generateRoutes(addresses, config));
    }

    onRoutePanelDiscard() {
        this.props.dispatch(discardRouteDrafts());
    }

    onRoutePanelRouteMouseOver(route) {
        this.redrawMarkers(route.addresses);
    }

    onRoutePanelRouteMouseOut(route) {
        this.redrawMarkers();
    }
}
