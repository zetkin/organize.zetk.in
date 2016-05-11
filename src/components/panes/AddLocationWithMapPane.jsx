import React from 'react';
import { connect } from 'react-redux';

import LocationMap from '../misc/LocationMap';
import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import { setPendingLocation, clearPendingLocation, createLocation }
    from '../../actions/location';


@connect(state => state)
export default class AddLocationPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add Location';
    }

    renderPaneContent(data) {
        let locationStore = this.props.locations;
        let pendingLocation = locationStore.pendingLocation;
        let locations = locationStore.locationList.items.map(i => i.data);

        let style = {
            position: 'relative',
            height: '300px',
            width: '100%'
        }

        return [ 
            <h3>1. Click on map to add location position</h3>,
            <LocationMap 
                    style={ style } 
                    pendingLocation={ pendingLocation }
                    onLocationChange={ this.onUpdatePosition.bind(this) }
                    locationsForBounds={ locations }
                    onMapClick={ this.onUpdatePosition.bind(this) } />,
            <h3>2. Enter information about the location and press save</h3>,
            <LocationForm key="form" ref="form" loc={ data.loc }
                onSubmit={ this.onSubmit.bind(this) }/>
        ]
    }

    onUpdatePosition (position) {
        this.props.dispatch(setPendingLocation(position));
    }

    onSubmit(ev) {
        ev.preventDefault();

        var values = this.refs.form.getChangedValues();

        // if pendingLatLng dont exist warn user
        var pendingLatLng = this.props.locations.pendingLocation;
        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }
        else {
            alert('Please select a position for the location \n\rdev todo: create real validation feedback');
            return false;
        }

        this.props.dispatch(createLocation(values));
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
