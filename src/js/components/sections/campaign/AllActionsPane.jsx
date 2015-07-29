import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


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
            <ul>
                {actions.map(function(a) {
                    return (
                        <li key={ a.id }>
                            { a.id }
                        </li>
                    );
                }, this)}
            </ul>
        );
    }
}
