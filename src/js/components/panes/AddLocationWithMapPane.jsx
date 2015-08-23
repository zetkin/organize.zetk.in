import React from 'react/addons';

import LocationMap from '../misc/LocationMap';
import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';


export default class AddLocationPane extends PaneBase {
    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
        // get bounds and center
    }

    getPaneTitle(data) {
        return 'Add Location';
    }

    renderPaneContent(data) {
        var locationStore = this.getStore('location');
        var pendingLocation = locationStore.getPendingLocation();
        var style = {
            position: 'relative',
            height: '300px',
            width: '100%'
        }
        return [ 
            <h3>1. Click on map add position of location</h3>,
            <LocationMap 
                    style={ style } 
                    pendingLocation={ pendingLocation }
                    onLocationChange={ this.onUpdatePosition.bind(this) }
                    locationsForBounds={locationStore.getLocations()}
                    onMapClick={ this.onUpdatePosition.bind(this) } />,
            <h3>2. Enter information about the location and press save</h3>,
            <LocationForm key="form" ref="form" loc={ data.loc }
                onSubmit={ this.onSubmit.bind(this) }/>
        ]
    }

    onUpdatePosition (position) {
        this.getActions('location').setPendingLocation(position);
    }

    onSubmit(ev) {
        ev.preventDefault();
        var values = this.refs.form.getChangedValues();
        // if pendingLatLng dont exist warn user
        //
        var pendingLatLng = this.getStore('location').getPendingLocation();
        console.log('pendingLatLng', pendingLatLng);
        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }
        else {
            alert('Please select a position for the location \n\rdev todo: create real validation feedback');
            return false;
        }
        this.getActions('location').createLocation(values);
        this.getActions('location').clearPendingLocation();
        this.closePane();
    }
    onCloseClick() {
        this.closePane();
        this.getActions('location').clearPendingLocation();
    }
}
