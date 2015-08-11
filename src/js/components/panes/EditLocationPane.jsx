import React from 'react/addons';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';


export default class LocationPane extends PaneBase {
    componentDidMount() {
        this.listenTo('location', this.forceUpdate);

        var locationId = this.props.params[0];
        var loc = this.getStore('location').getLocation(locationId);
        this.getActions('location').setPendingLocation(loc);
    }

    getRenderData() {
        var locationStore = this.getStore('location');
        var locationId = this.props.params[0];

        return {
            loc: this.getStore('location').getLocation(locationId)
        }
    }

    getPaneTitle(data) {
        if (data.loc) {
            return data.loc.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.loc) {
            // TODO: Render form
            return [
                <LocationForm key="form" ref="form" loc={ data.loc }
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

        var locationId = this.props.params[0];
        var values = this.refs.form.getChangedValues();
        var pendingLatLng = this.getStore('location').getPendingLocation();
        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }
        this.getActions('location').updateLocation(locationId, values);
    }


    onDeleteClick(ev) {
        var locationId = this.props.params[0];
        this.getActions('location').deleteLocation(locationId);
        this.getActions('location').clearPendingLocation();
        this.closePane();
    }
    onCloseClick() {
        this.closePane();
        this.getActions('location').clearPendingLocation();
    }
}
