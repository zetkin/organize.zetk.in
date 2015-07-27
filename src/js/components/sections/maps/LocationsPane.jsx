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
                <LocationMap style={ style} locations={ locations }
                    onLocationSelect={ this.onLocationSelect.bind(this) }/>
            );
        }
        else if (this.state.viewMode == 'list') {
            content = (
                <ul>
                {locations.map(function(loc) {
                    return (
                        <li onClick={ this.onLocationSelect.bind(this, loc) }>
                            { loc.title }
                        </li>
                    );
                }, this)}
                </ul>
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

    onLocationSelect(loc) {
        this.gotoSubPane('location', loc.id);
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }
}
