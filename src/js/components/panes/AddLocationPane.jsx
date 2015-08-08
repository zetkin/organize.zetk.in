import React from 'react/addons';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';


export default class AddLocationPane extends PaneBase {
    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
    }

    getPaneTitle(data) {
        return 'Add Location';
    }

    renderPaneContent(data) {
        return [ 
            <LocationForm key="form" ref="form" loc={ data.loc }
                onSubmit={ this.onSubmit.bind(this) }/>,
            <input key="submit" type="button" value="Change position"
                onClick={ this.onChangePositionClick.bind(this) }/>,
            <input key="delete" type="button" value="Delete"
                    onClick={ this.onDeleteClick.bind(this) }/>
        ]
    }

    onSubmit(ev) {
        ev.preventDefault();
        var values = this.refs.form.getChangedValues();
        var pendingLatLng = this.getStore('location').getPendingLocation();
        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }
        this.getActions('location').createLocation(values);
    }
    onDeleteClick(ev) {
        console.log('cancel');
    }
    onCloseClick() {
        this.closePane();
        this.getActions('location').clearPendingLocation();
    }
    onChangePositionClick(ev) {
        var loc =  this.getStore('location').getPendingLocation();
        loc.editable = true;
        this.getActions('location').setPendingLocation(loc);
    }
}
