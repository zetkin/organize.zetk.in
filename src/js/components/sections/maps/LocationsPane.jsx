import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import LocationMap from '../../misc/LocationMap';
import ViewSwitch from '../../misc/ViewSwitch';

export default class LocationsPane extends PaneBase {
    constructor(props) {
        super(props)

        this.state = {
            viewMode: 'map'
        };
    }

    getPaneTitle() {
        return 'Locations';
    }

    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
        this.getActions('location').retrieveLocations();
    }

    renderPaneContent() {
        var content;
        var locationStore = this.getStore('location');

        var locations = locationStore.getLocations();
        // add pending to location list
        var pendingLocation = locationStore.getPendingLocation();

        var switchStates = {
            'map': 'Map',
            'list': 'List'
        };

        if (this.state.viewMode == 'map') {
            var style = {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            content = (
                <div>
                <input value="Add" type="button"
                    className={ 'locations-map-button' }
                    onClick={ this.onAddClick.bind(this) } />
                <LocationMap style={ style } 
                    locations={ locations }
                    locationsForBounds={ locations }
                    pendingLocation={ pendingLocation }
                    ref="locationMap"
                    onLocationChange={ this.onLocationChange.bind(this) }
                    onLocationSelect={ this.onLocationSelect.bind(this) }/>
                </div>
            );
        }
        else if (this.state.viewMode == 'list') {
            content = (
                <div>
                    <input type="button" value="Add" onClick={ this.onAddClick.bind(this) }/>
                    <ul>
                    {locations.map(function(loc) {
                        return (
                            <li onClick={ this.onLocationSelect.bind(this, loc) }>
                                { loc.title }
                            </li>
                        );
                    }, this)}
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <ViewSwitch states={ switchStates }
                    selected={ this.state.viewMode }
                    onSwitch={ this.onViewSwitch.bind(this) }/>

                { content }
            </div>
        );
    }
    onAddClick() {
        // TODO: when in list mode what to use as center?
        var loc = {
            lat: 51.139000385664374,
            lng: 11.265701483215253
        };
        if (this.refs.locationMap) {
           var center = this.refs.locationMap.map.getCenter();
           loc.lat = center.lat();
           loc.lng = center.lng();
        }
        
        this.getActions('location').setPendingLocation(loc);
        this.gotoSubPane('addlocation');
        this.setState({
            viewMode: 'map'
        });
    }

    onLocationSelect(loc) {
        this.gotoSubPane('location', loc.id);
    }
    onLocationChange(loc) {
        this.getActions('location').setPendingLocation(loc);
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }
}
