import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import { retrieveLocation, updateLocation, deleteLocation,
    setPendingLocation, clearPendingLocation } from '../../actions/location';
import { getListItemById } from '../../utils/store';


@connect(state => state)
export default class LocationPane extends PaneBase {
    componentDidMount() {
        let locId = this.getParam(0);
        let locItem = getListItemById(this.props.locations.locationList, locId);

        if (locItem) {
            this.props.dispatch(setPendingLocation(locItem.data));
        }
        else {
            this.props.dispatch(retrieveLocation(locId));
        }
    }

    getRenderData() {
        let locId = this.getParam(0);

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
            // TODO: Render form
            return [
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

    onSubmit(ev) {
        ev.preventDefault();

        var locationId = this.getParam(0);
        var values = this.refs.form.getChangedValues();
        var pendingLatLng = this.props.locations.pendingLocation;
        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }

        this.props.dispatch(updateLocation(locationId, values));
    }


    onDeleteClick(ev) {
        var locationId = this.getParam(0);
        this.props.dispatch(clearPendingLocation());
        this.props.dispatch(deleteLocation(locationId));
        this.closePane();
    }

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
