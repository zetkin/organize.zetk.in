import React from 'react';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import LocationMap from '../misc/LocationMap';


export default class LocationPane extends PaneBase {
    componentDidMount() {
        this.listenTo('location', this.forceUpdate);

        const locationId = this.props.params[0];
        const loc = this.getStore('location').getLocation(locationId);

        if (loc) {
            this.getActions('location').setPendingLocation(loc);
        }
        else {
            this.getActions('location').retrieveLocation(locationId);
        }
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
            var locationStore = this.getStore('location');
            var pendingLocation = locationStore.getPendingLocation();
            var style = {
                position: 'relative',
                height: '300px',
                width: '100%'
            }
            return [

                <LocationMap
                        style={ style }
                        pendingLocation={ pendingLocation }
                        onLocationChange={ this.onUpdatePosition.bind(this) }
                        locationsForBounds={locationStore.getLocations()}
                        onMapClick={ this.onUpdatePosition.bind(this) } />,
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

    onUpdatePosition (position) {
        this.getActions('location').setPendingLocation(position);
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
        this.getActions('location')
            .updateLocation(locationId, values)
            .then(this.closePane.bind(this));
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
