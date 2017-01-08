import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import Button from '../../misc/Button';
import LocationList from '../../lists/LocationList';
import { retrieveLocations } from '../../../actions/location';


@connect(state => state)
export default class LocationsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveLocations());
    }

    renderPaneContent() {
        let content = null;
        let locationList = this.props.locations.locationList;
        
        return (
            <div>
                <LocationList locationList={ locationList }
                    onItemClick={ this.onLocationSelect.bind(this) }/>
            </div>
        );
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="LocationsPane-addLocationButton"
                labelMsg="panes.locations.addButton"
                onClick={ this.onAddClick.bind(this) }/>
        ];
    }

    onAddClick() {
        this.openPane('addlocation');
    }

    onLocationSelect(loc) {
        this.openPane('location', loc.data.id);
    }
}
