import React from 'react/addons';

import PaneBase from './PaneBase';


export default class EditActionPane extends PaneBase {
    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
    }

    getRenderData() {
        var actionId = this.props.params[0];
        var actionStore = this.getStore('action');

        return {
            action: actionStore.getAction(actionId)
        }
    }

    getPaneTitle(data) {
        if (data.action) {
            return data.action.id;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.action) {
            return data.action.id;
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }
}
