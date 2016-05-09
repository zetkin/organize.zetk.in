import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionList from '../../misc/actionlist/ActionList';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionCalendar from '../../misc/actioncal/ActionCalendar';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveCampaigns } from '../../../actions/campaign';


@connect(state => state)
export default class AllActionsPane extends CampaignSectionPaneBase {
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
        super.componentDidMount();

        this.listenTo('action', this.forceUpdate);
        this.getActions('action').retrieveAllActions();

        this.props.dispatch(retrieveCampaigns());
    }

    renderPaneContent() {
        var actionStore = this.getStore('action');
        var actions = actionStore.getActions();
        var viewComponent;

        var startDate, endDate;
        if (actions.length == 0) {
            // Use this week and the next month by default
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const date = now.getDate();
            startDate = new Date(year, month, date - 5);
            endDate = new Date(year, month, date + 30);
        }

        if (this.state.viewMode == 'cal') {
            viewComponent = <ActionCalendar actions={ actions }
                    startDate={ startDate } endDate={ endDate }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onCopyAction={ this.onCalendarCopyAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
        }
        else {
            viewComponent = <ActionList actions={ actions }
                onMoveParticipant={ this.onMoveParticipant.bind(this) }
                onActionOperation={ this.onActionOperation.bind(this) }/>;
        }

        return viewComponent;
    }

    getPaneTools(data) {
        const viewStates = {
            'cal': 'Calendar',
            'list': 'List'
        };

        return [
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>,
            <ViewSwitch states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>
        ];
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }

    onActionOperation(action, operation) {
        if (operation == 'edit') {
            this.openPane('editaction', action.id);
        }
        else if (operation == 'sendreminders') {
            this.openPane('reminder', action.id);
        }
    }

    onMoveParticipant(action, person, oldAction) {
        this.getActions('participant').moveParticipant(
            person.id, oldAction.id, action.id);

        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        if (moves.length) {
            this.pushPane('moveparticipants');
        }
    }
}
