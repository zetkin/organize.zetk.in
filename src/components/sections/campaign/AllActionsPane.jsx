import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionList from '../../lists/ActionList';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionCalendar from '../../misc/actioncal/ActionCalendar';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveCampaigns } from '../../../actions/campaign';
import { retrieveActions } from '../../../actions/action';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => ({
    actions: state.actions,
    campaigns: state.campaigns,
    filteredActionList: filteredActionList(state)
});

@connect(mapStateToProps)
export default class AllActionsPane extends CampaignSectionPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'cal'
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveCampaigns());
    }

    renderPaneContent() {
        let actionList = this.props.filteredActionList;
        let viewComponent;

        let startDate, endDate;

        if (actionList.items.length == 0) {
            // Use this week and the next month by default
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const date = now.getDate();
            startDate = new Date(year, month, date - 5);
            endDate = new Date(year, month, date + 30);
        }

        if (this.state.viewMode == 'cal') {
            let actions = actionList.items.map(i => i.data);

            viewComponent = <ActionCalendar actions={ actions }
                    startDate={ startDate } endDate={ endDate }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onCopyAction={ this.onCalendarCopyAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
        }
        else {
            viewComponent = <ActionList actionList={ actionList }
                onSelect={ item => this.onSelectAction(item.data) }/>
        }

        return viewComponent;
    }

    getPaneTools(data) {
        const viewStates = {
            'cal': 'panes.allActions.viewModes.calendar',
            'list': 'panes.allActions.viewModes.list'
        };

        return [
            <CampaignSelect key="campaignSelect"
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>,
            <ViewSwitch key="viewSwitch" states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>
        ];
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }
}
