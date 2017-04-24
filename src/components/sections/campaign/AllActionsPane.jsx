import React from 'react';
import { connect } from 'react-redux';

import Button from '../../misc/Button';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionList from '../../lists/ActionList';
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
                onItemClick={ (item, ev) => this.onSelectAction(item.data, ev) }/>
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
            <Button key="addButton"
                className="allActionsPane-addButton"
                labelMsg="panes.allActions.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }

    onAddClick() {
        this.openPane('addaction');
    }
}
