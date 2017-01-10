import React from 'react';
import { connect } from 'react-redux';

import RootPaneBase from '../RootPaneBase';
import Button from '../../misc/Button';
import LocationMap from '../../misc/LocationMap';
import ViewSwitch from '../../misc/ViewSwitch';
import LocationList from '../../lists/LocationList';
import { retrieveLocations, setPendingLocation }
    from '../../../actions/location';


@connect(state => state)
export default class LocationsPane extends RootPaneBase {
    constructor(props) {
        super(props)

        this.state = {
            viewMode: 'map'
        };
    }

    componentDidMount() {
        super.componentDidMount();

        // TODO: Do this only if data is old or does not exist
        this.props.dispatch(retrieveLocations());
    }

    renderPaneContent() {
        let content = null;
        let locationList = this.props.locations.locationList;
        
        // add pending to location list
        let pendingLocation = this.props.locations.pendingLocation;

        if (this.state.viewMode == 'map') {
            var style = {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            content = (
                <LocationMap style={ style }
                    locations={ locationList.items }
                    locationsForBounds={ locationList.items }
                    pendingLocation={ pendingLocation }
                    ref="locationMap"
                    onLocationChange={ this.onLocationChange.bind(this) }
                    onLocationSelect={ this.onLocationSelect.bind(this) }/>
            );
        }
        else if (this.state.viewMode == 'list') {
            content = (
                <LocationList locationList={ locationList }
                    onItemClick={ this.onLocationSelect.bind(this) }/>
            );
        }

        return (
            <div>
                { content }
            </div>
        );
    }

    getPaneTools(data) {
        const switchStates = {
            'map': 'panes.locations.viewModes.map',
            'list': 'panes.locations.viewModes.list',
        };

        return [
            <ViewSwitch key="viewSwitch" states={ switchStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>,
            <Button key="addButton"
                className="LocationsPane-addLocationButton"
                labelMsg="panes.locations.addButton"
                onClick={ this.onAddClick.bind(this) }/>
        ];
    }

    onAddClick() {
        // TODO: when in list mode what to use as center?
        let loc = {
            lat: 51.139000385664374,
            lng: 11.265701483215253
        };

        if (this.refs.locationMap) {
           var center = this.refs.locationMap.map.getCenter();
           loc.lat = center.lat();
           loc.lng = center.lng();
        }

        this.props.dispatch(setPendingLocation(loc));
        this.openPane('addlocation');
        this.setState({
            viewMode: 'map'
        });
    }

    onLocationSelect(loc) {
        this.openPane('location', loc.data.id);
    }

    onLocationChange(loc) {
        this.props.dispatch(setPendingLocation(loc));
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }
}
