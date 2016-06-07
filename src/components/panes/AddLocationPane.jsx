import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import Button from '../misc/Button';
import { getLocationAverage } from '../../utils/location';
import { setPendingLocation, clearPendingLocation, createLocation }
    from '../../actions/location';


@connect(state => state)
export default class AddLocationPane extends PaneBase {
    componentDidMount() {
        let pendingLocation = this.props.locations.pendingLocation;

        // When mounting pane from page reload set pendinglocation 
        if (pendingLocation === false) {
            let locList = this.props.locations.locationList;
            let locCenter = getLocationAverage(locList);

            this.props.dispatch(setPendingLocation(locCenter));
        }
    }

    getPaneTitle(data) {
        return 'Add Location';
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return [
            <h3>1. Move highlighted marker to the position of location</h3>,
            <h3>2. Enter information about the location and press save</h3>,
            <LocationForm key="form" ref="form" loc={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        ];
    }

    renderPaneFooter(data) {
        return [
            <Button className="AddLocationPane-closeButton"
                label="Close"
                onClick={ this.onDeleteClick.bind(this) }/>,
            <Button className="AddLocationPane-saveButton"
                label="Add Location"
                onClick={ this.onSubmit.bind(this) }/>
        ];
    }

    onSubmit(ev) {
        ev.preventDefault();
        var values = this.refs.form.getValues();

        var pendingLatLng = this.props.locations.pendingLocation;

        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }

        this.props.dispatch(createLocation(values));
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }

    onDeleteClick(ev) {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
