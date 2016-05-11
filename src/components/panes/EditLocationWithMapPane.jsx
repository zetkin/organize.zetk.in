import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import LocationMap from '../misc/LocationMap';
import { getListItemById } from '../../utils/store';
import { retrieveLocation, updateLocation, deleteLocation,
    setPendingLocation, clearPendingLocation } from '../../actions/location';


@connect(state => state)
export default class LocationPane extends PaneBase {
    componentDidMount() {
        let locId = this.props.params[0];
        let locItem = getListItemById(this.props.locations.locationList, locId);

        if (locItem) {
            this.props.dispatch(setPendingLocation(locItem.data));
        }
        else {
            this.props.dispatch(retrieveLocation(locId));
        }
    }

    getRenderData() {
        let locId = this.props.params[0];

        return {
            locItem: getListItemById(this.props.locations.locationList, locId),
        }
    }

    getPaneTitle(data) {
        if (data.locItem) {
            return data.locItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.locItem) {
            let locationStore = this.props.locations;
            let pendingLocation = data.locItem.data;
            let locations = locationStore.locationList.items.map(i => i.data);

            let style = {
                position: 'relative',
                height: '300px',
                width: '100%'
            }

            return [
                <LocationMap
                        style={ style }
                        pendingLocation={ pendingLocation }
                        onLocationChange={ this.onUpdatePosition.bind(this) }
                        locationsForBounds={ locations }
                        onMapClick={ this.onUpdatePosition.bind(this) } />,
                <LocationForm key="form" ref="form" loc={ data.locItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <input key="delete" type="button" value="Delete"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onUpdatePosition (position) {
        this.props.dispatch(setPendingLocation(position));
    }

    onSubmit(ev) {
        ev.preventDefault();

        let locId = this.props.params[0];
        let values = this.refs.form.getChangedValues();
        let pendingLatLng = this.props.locations.pendingLocation;

        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }

        this.props.dispatch(updateLocation(locId, values));
    }


    onDeleteClick(ev) {
        var locId = this.props.params[0];
        this.props.dispatch(clearPendingLocation());
        this.props.dispatch(deleteLocation(locationId));
        this.closePane();
    }

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
