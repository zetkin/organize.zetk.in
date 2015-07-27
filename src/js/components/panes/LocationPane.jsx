import React from 'react/addons';

import PaneBase from './PaneBase';


export default class LocationPane extends PaneBase {
    componentDidMount() {
        this.listenTo('location', this.forceUpdate);
    }

    getRenderData() {
        var locationStore = this.getStore('location');
        var locationId = this.props.params[0];

        return {
            loc: locationStore.getLocation(locationId)
        }
    }

    getPaneTitle(data) {
        if (data.loc) {
            return data.loc.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.loc) {
            // TODO: Render form
            return data.loc.title;
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }
}
