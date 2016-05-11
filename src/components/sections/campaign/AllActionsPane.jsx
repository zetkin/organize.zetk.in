import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionList from '../../misc/actionlist/ActionList';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionCalendar from '../../misc/actioncal/ActionCalendar';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveCampaigns } from '../../../actions/campaign';
import { retrieveActions } from '../../../actions/action';
import { moveActionParticipant } from '../../../actions/participant';


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

        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveCampaigns());
    }

    renderPaneContent() {
        let actionList = this.props.actions.actionList;
        let actions = actionList.items.map(i => i.data);
        let viewComponent;

        let startDate, endDate;

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
                dispatch={ this.props.dispatch }
                participants={ this.props.participants }
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
        this.props.dispatch(moveActionParticipant(
            person.id, oldAction.id, action.id));

        let participantStore = this.props.participants;
        let moves = participantStore.moves;

        if (moves.length) {
            this.pushPane('moveparticipants');
        }
    }
}
