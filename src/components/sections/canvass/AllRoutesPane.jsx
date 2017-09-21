import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import RoutePanel from './elements/RoutePanel';
import SelectInput from '../../forms/inputs/SelectInput';
import { retrieveAddresses } from '../../../actions/address';
import { retrieveLocationTags } from '../../../actions/locationTag';
import {
    commitRouteDrafts,
    discardRouteDrafts,
    generateRoutes,
} from '../../../actions/route';
import { getLocationAverage } from '../../../utils/location';


const mapStateToProps = state => ({
    tagList: state.locationTags.tagList,
    addressList: state.addresses.addressList,
    generator: state.routes.generator,
    routeList: state.routes.routeList,
    draftList: state.routes.draftList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllRoutesPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveAddresses());
        this.props.dispatch(retrieveLocationTags());

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
        if (this.props.addressList != prevProps.addressList) {
            this.resetMarkers();
        }
    }

    getRenderData() {
        return {
            addressList: this.props.addressList,
        };
    }

    getPaneFilters(data, filters) {
        let tagOptions = {
            '_': this.props.intl.formatMessage({
                id: 'panes.allRoutes.filters.tag.nullOption' }),
         };

         if (this.props.tagList && this.props.tagList.items) {
             this.props.tagList.items.forEach(item => {
                 tagOptions[item.data.id] = item.data.title;
             });
         }


        return [
            <div key="filters">
                <Msg tagName="label"
                    id="panes.allRoutes.filters.tag.label"/>
                <SelectInput name="tag" options={ tagOptions }
                    value={ filters.tag || '_' }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
            </div>
        ];
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
                onCommitDrafts={ this.onRoutePanelCommit.bind(this) }
                onDiscardDrafts={ this.onRoutePanelDiscard.bind(this) }
                onRouteMouseOver={ this.onRoutePanelRouteMouseOver.bind(this) }
                onRouteMouseOut={ this.onRoutePanelRouteMouseOut.bind(this) }
                />
        ];
    }

    resetMarkers() {
        let marker;
        let addressList = this.props.addressList;

        // Remove existing markers
        while (marker = this.markers.pop()) {
            marker.marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker.marker);
        }

        if (addressList.items && !addressList.isPending) {
            let tagId = this.state.filters.tag;
            let addresses = this.props.addressList.items.map(i => i.data);

            if (tagId && tagId != '_') {
                addresses = addresses
                    .filter(addr => addr.tags.indexOf(tagId) >= 0);
            }

            addresses.forEach(addr => {
                let latLng = new google.maps.LatLng(addr.latitude, addr.longitude);

                marker = new google.maps.Marker({
                    icon: this.defaultIcon,
                    position: latLng,
                    map: this.map,
                    title: addr.title,
                    zIndex: 0,
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

    onRoutePanelGenerate(addresses, config) {
        this.props.dispatch(generateRoutes(addresses, config));
    }

    onRoutePanelCommit() {
        this.props.dispatch(commitRouteDrafts());
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

    onFiltersApply(filters) {
        this.setState({ filters }, () => this.resetMarkers());
    }
}
