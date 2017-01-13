import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import LocationMap from '../misc/LocationMap';
import { getListItemById } from '../../utils/store';
import {
    savePendingLocation,
    finishPendingLocation
} from '../../actions/location';


@connect(state => ({ locations: state.locations }))
@injectIntl
export default class PlaceLocationPane extends PaneBase {
    getRenderData() {
        let locationList = this.props.locations.locationList;

        return {
            locationList: locationList,
        };
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.placeLocation.instructions' });
    }

    renderPaneContent(data) {
        let id = this.getParam(0);
        let pendingLocationList = this.props.locations.pendingLocationList;
        let pendingLocationItem = getListItemById(pendingLocationList, id);
        let pendingLocation = pendingLocationItem.data.position;

        let style = {
            position: 'absolute',
        };

        return [
            <LocationMap key="map" style={ style }
                pendingLocation={ pendingLocation }
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
        let id = this.getParam(0);
        this.props.dispatch(savePendingLocation(id, loc));
    }

    onClickSave(ev) {
        let id = this.getParam(0);
        this.props.dispatch(finishPendingLocation(id));
        this.closePane();
    }

    onClickCancel(ev) {
        this.closePane();
    }
}
