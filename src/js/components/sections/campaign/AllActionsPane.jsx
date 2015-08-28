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
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
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

    onCalendarAddAction(date) {
        // TODO: Pass date to new action somehow
        this.gotoSubPane('addaction');
    }

    onCalendarMoveAction(action, date) {
        const oldStartTime = new Date(action.start_time);
        const oldEndTime = new Date(action.end_time);

        const startTime = new Date(date);
        startTime.setHours(oldStartTime.getHours());
        startTime.setMinutes(oldStartTime.getMinutes());
        startTime.setSeconds(oldStartTime.getSeconds());

        const endTime = new Date(date);
        endTime.setHours(oldEndTime.getHours());
        endTime.setMinutes(oldEndTime.getMinutes());
        endTime.setSeconds(oldEndTime.getSeconds());

        const values = {
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        };

        this.getActions('action').updateAction(action.id, values);
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
