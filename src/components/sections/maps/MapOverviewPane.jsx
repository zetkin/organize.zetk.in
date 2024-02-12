import React from 'react';
import { connect } from 'react-redux';

import RootPaneBase from '../RootPaneBase';
import LocationMap from '../../misc/LocationMap';
import { retrieveLocations } from '../../../actions/location';

let altKeyDown = false;

let onKeyDown = ev => altKeyDown = (ev.keyCode == 18)? true : altKeyDown;
let onKeyUp = ev => altKeyDown = (ev.keyCode == 18)? false : altKeyDown;


const mapStateToProps = state => ({
    locationList: state.locations.locationList,
});


@connect(mapStateToProps)
export default class MapOverviewPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        this.props.dispatch(retrieveLocations());
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
    }

    renderPaneContent() {
        let content = null;
        let locationList = this.props.locationList;

        var style = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
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
        if (altKeyDown) {
            this.openPane('editlocation', loc.data.id);
        }
        else {
            this.openPane('location', loc.data.id);
        }
    }
}
