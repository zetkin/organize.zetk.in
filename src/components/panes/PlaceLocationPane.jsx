import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import LocationMap from '../misc/LocationMap';
import { getListItemById } from '../../utils/store';
import { updateLocation } from '../../actions/location';


@connect(state => ({ locations: state.locations }))
export default class PlaceLocationPane extends PaneBase {
    constructor(props) {
        super(props);

        let locationList = this.props.locations.locationList;
        let locationItem = getListItemById(locationList, this.getParam(0));

        if (locationItem) {
            this.state = {
                pendingLocation: {
                    lat: locationItem.data.lat,
                    lng: locationItem.data.lng,
                },
            };
        }
        else {
            this.state = {
                pendingLocation: null,
            };
        }
    }

    getRenderData() {
        let locationList = this.props.locations.locationList;

        return {
            locationList: locationList,
        };
    }

    getPaneTitle(data) {
        return '';
    }

    renderPaneContent(data) {
        let style = {
            position: 'absolute',
        };

        return [
            <LocationMap key="map" style={ style }
                pendingLocation={ this.state.pendingLocation }
                locationsForBounds={ data.locationList.items }
                onLocationChange={ this.onLocationChange.bind(this) }
                />
        ];
    }

    renderPaneFooter(data) {
        return [
            <Button key="closeButton"
                className="PlaceLocationPane-closeButton"
                labelMsg="panes.placeLocation.closeButton"
                onClick={ this.onClickCancel.bind(this) }/>,
            <Button key="saveButton"
                className="PlaceLocationPane-saveButton"
                labelMsg="panes.placeLocation.saveButton"
                onClick={ this.onClickSave.bind(this) }/>,
        ];
    }

    onLocationChange(loc) {
        this.setState({
            pendingLocation: loc,
        });
    }

    onClickSave(ev) {
        let id = this.getParam(0);
        this.props.dispatch(updateLocation(id, this.state.pendingLocation));
        this.closePane();
    }

    onClickCancel(ev) {
        this.closePane();
    }
}
