import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import ActionList from '../../misc/actionlist/ActionList';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionCalendar from '../../misc/actioncal/ActionCalendar';
import ViewSwitch from '../../misc/ViewSwitch';


export default class AllActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'cal'
        };
    }

    getPaneTitle() {
        return 'All actions';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.listenTo('participant', this.onParticipantStoreUpdate);
        this.getActions('action').retrieveAllActions();

        this.openMovePane();
    }

    renderPaneContent() {
        var actionStore = this.getStore('action');
        var actions = actionStore.getActions();
        var viewComponent;

        if (this.state.viewMode == 'cal') {
            viewComponent = <ActionCalendar actions={ actions }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
        }
        else {
            viewComponent = <ActionList actions={ actions }
                    onActionOperation={ this.onActionOperation.bind(this) }/>;
        }

        const viewStates = {
            'cal': 'Calendar',
            'list': 'List'
        };

        return [
            <ViewSwitch states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>,

            <CampaignSelect/>,
            viewComponent
        ];
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }

    onSelectAction(action) {
        this.gotoSubPane('editaction', action.id);
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
