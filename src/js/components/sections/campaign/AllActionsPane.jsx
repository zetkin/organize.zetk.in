import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import ActionList from '../../misc/actionlist/ActionList';


export default class AllActionsPane extends PaneBase {
    getPaneTitle() {
        return 'All actions';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('participant', this.onParticipantStoreUpdate);
        this.getActions('action').retrieveAllActions();

        this.openMovePane();
    }

    renderPaneContent() {
        var actionStore = this.getStore('action');
        var actions = actionStore.getActions();

        return (
            <ActionList actions={ actions }
                onActionOperation={ this.onActionOperation.bind(this) }/>
        );
    }

    onActionOperation(action, operation) {
        if (operation == 'edit') {
            this.gotoSubPane('editaction', action.id);
        }
    }

    onParticipantStoreUpdate() {
        this.openMovePane();
    }

    openMovePane() {
        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        if (moves.length) {
            this.gotoSubPane('moveparticipants');
        }
    }
}
