import React from 'react';
import { injectIntl } from 'react-intl';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import Button from '../misc/Button';
import Link from '../misc/Link';
import StaticMap from '../misc/StaticMap';
import { getListItemById } from '../../utils/store';
import { getLocationAverage } from '../../utils/location';
import {
    createPendingLocation,
    createLocation,
} from '../../actions/location';


@connect(state => ({ locations: state.locations }))
@injectIntl
export default class AddLocationPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            pendingLocation: null,
        };
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.addLocation.title' });
    }

    renderPaneContent(data) {
        let map;
        let initialData = {
            title: this.getParam(0)
        };

        map = (
            <StaticMap key="map"
                location={ this.state.pendingLocation }
                onClick={ this.onSetPositionClick.bind(this) }
                />
        );

        return [
            <LocationForm key="form" ref="form"
                loc={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>,
            map,
        ];
    }

    renderPaneFooter(data) {
        if (this.state.pendingLocation) {
            return (
                <Button className="AddLocationPane-saveButton"
                    labelMsg="panes.addLocation.saveButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    onSetPositionClick() {
        let initialPosition = this.state.pendingLocation;

        if (!initialPosition) {
            let locationList = this.props.locations.locationList;
            initialPosition = getLocationAverage(locationList);
        }

        let action = createPendingLocation(initialPosition, pos => {
            this.setState({
                pendingLocation: pos,
            });
        });

        this.props.dispatch(action);
        this.openPane('placelocation', action.payload.id);
    }

    onSubmit(ev) {
        ev.preventDefault();
        var values = this.refs.form.getValues();

        var pendingLatLng = this.state.pendingLocation;

        if (pendingLatLng) {
            values.lat = pendingLatLng.lat;
            values.lng = pendingLatLng.lng;
        }

        this.props.dispatch(createLocation(values));
        this.closePane();
    }
}
