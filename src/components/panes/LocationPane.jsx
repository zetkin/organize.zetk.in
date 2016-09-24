import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
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
            console.log(data.locItem)
            // TODO: Render form
            return (
                <div>
                    <p>{ data.locItem.data.info_text }</p>
                    <a onClick={() => {
                        this.onLocationEdit(data.locItem.data)
                    }}>Edit</a>
                </div>
            );
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onLocationEdit(loc) {
        this.openPane('editlocation', loc.id)
    }

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
