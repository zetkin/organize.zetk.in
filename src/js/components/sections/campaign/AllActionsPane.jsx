import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import ActionList from '../../misc/actionlist/ActionList';


export default class AllActionsPane extends PaneBase {
    getPaneTitle() {
        return 'All actions';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.getActions('action').retrieveAllActions();
    }

    renderPaneContent() {
        var actionStore = this.getStore('action');
        var actions = actionStore.getActions();

        return (
            <ActionList actions={ actions }/>
        );
    }
}
