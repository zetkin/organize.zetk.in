import React from 'react';
import { connect } from 'react-redux';

import RootPaneBase from '../RootPaneBase';
import LocationMap from '../../misc/LocationMap';
import { retrieveLocations } from '../../../actions/location';


@connect(state => state)
export default class MapOverviewPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveLocations());
    }

    renderPaneContent() {
        let content = null;
        let locationList = this.props.locations.locationList;

        var style = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        return (
            <div>
                <LocationMap style={ style }
                    locations={ locationList.items }
                    locationsForBounds={ locationList.items }
                    onLocationSelect={ this.onLocationSelect.bind(this) }/>
            </div>
        );
    }

    onLocationSelect(loc) {
        this.openPane('location', loc.data.id);
    }
}
