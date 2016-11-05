import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionList from '../../lists/ActionList';
import CampaignSelect from '../../misc/CampaignSelect';
import DateInput from '../../forms/inputs/DateInput';
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
            viewMode: 'cal',
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

        // Use afterDate filter as startDate, or today if it's null
        let startDate = this.props.actions.filters.afterDate?
            Date.create(this.props.actions.filters.afterDate) : new Date();

        // Default to no end date (which displays all actions) or, if there
        // are no actions, use 8 weeks in future. If there is a filter, use
        // that date.
        let endDate = null;
        if (this.props.actions.filters.beforeDate) {
            endDate = Date.create(this.props.actions.filters.beforeDate);
        }
        else if (actionList.items.length == 0) {
            endDate = startDate.clone().addDays(8 * 7);
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
                onItemClick={ item => this.onSelectAction(item.data) }/>
        }

        return viewComponent;
    }

    getPaneTools(data) {
        const viewStates = {
            'cal': 'panes.allActions.viewModes.calendar',
            'list': 'panes.allActions.viewModes.list'
        };

        return [
            <ViewSwitch key="viewSwitch" states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>,
        ];
    }

    getPaneFilters(data) {
        return [
            <CampaignSelect key="campaignSelect"
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>,
            <div key="dateFilter" className="AllActionsPane-dateFilter">
                <DateInput name="afterDate"
                    value={ this.props.actions.filters.afterDate }
                    labelMsg="panes.allActions.filters.afterDate"
                    onValueChange={ this.onFilterAfterDateChange.bind(this) }
                    />
                <DateInput name="beforeDate"
                    value={ this.props.actions.filters.beforeDate }
                    labelMsg="panes.allActions.filters.beforeDate"
                    onValueChange={ this.onFilterBeforeDateChange.bind(this) }
                    />
            </div>
        ];
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }

    onFilterAfterDateChange(name, value) {
        let beforeDate = this.props.actions.filters.beforeDate;
        this.props.dispatch(retrieveActions(value, beforeDate));
    }

    onFilterBeforeDateChange(name, value) {
        let afterDate = this.props.actions.filters.afterDate;
        this.props.dispatch(retrieveActions(afterDate, value));
    }
}
