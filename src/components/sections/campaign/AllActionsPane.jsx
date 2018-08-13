import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../misc/Button';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import BulkOpSelect from '../../bulk/BulkOpSelect';
import ActionList from '../../lists/ActionList';
import ActionCalendar from '../../misc/actioncal/ActionCalendar';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveCampaigns } from '../../../actions/campaign';
import { retrieveActions } from '../../../actions/action';
import { retrieveActivities } from '../../../actions/activity';
import { filteredActionList } from '../../../store/actions';
import { getListItemById } from '../../../utils/store';
import {
    createSelection,
    addToSelection,
    removeFromSelection,
} from '../../../actions/selection';


const mapStateToProps = state => ({
    actions: state.actions,
    campaigns: state.campaigns,
    activityList: state.activities.activityList,
    filteredActionList: filteredActionList(state),
    selectionList: state.selections.selectionList,
});

@connect(mapStateToProps)
export default class AllActionsPane extends CampaignSectionPaneBase {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            viewMode: 'cal',
            showOldActions: false
        });
    }

    componentDidMount() {
        super.componentDidMount();

        if (!this.props.filteredActionList) {
            this.props.dispatch(retrieveActions());
            this.props.dispatch(retrieveActivities());
            this.props.dispatch(retrieveCampaigns());
        }
    }

    getRenderData() {
        let selectionId = this.bulkSelectionId;
        let selectionList = this.props.selectionList;
        let selectionItem = getListItemById(selectionList, selectionId);

        return {
            selection: selectionItem? selectionItem.data : null,
        };
    }

    renderPaneContent(data) {
        let actionList = this.props.filteredActionList;
        if (!actionList || !actionList.items) {
            return null;
        }

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
            const {showOldActions} = this.state;
            const now = new Date();
            let allActions = [];
            let futureActions = [];
            let actions;
            let oldActionNotice;

            actionList.items.forEach( action => {
                const actionEnd = new Date(action.data.end_time);
                allActions.push(action)
                if (now < actionEnd) {
                    futureActions.push(action)
                }
            });

            if (!showOldActions && futureActions.length && futureActions.length < allActions.length) {
                actions = [...futureActions];
                oldActionNotice = <div key="oldActions" className="AllActionsPane-oldActions">
                    <Msg id="lists.actionList.oldActions.notice"
                        values={{ count: allActions.length - futureActions.length }}/>
                    <div className="AllActionsPane-oldActionsButtons" >
                        <span className="AllActionsPane-oldActionsButton"
                            onClick={this.onShowOldClick.bind(this)}>
                            <Msg id="lists.actionList.oldActions.showOld"/>
                        </span>
                        <span className="AllActionsPane-oldActionsButton"
                            onClick={this.onFilterButtonClick.bind(this)}>
                            <Msg id="lists.actionList.oldActions.changeFilter" />
                        </span>
                    </div>
                    
                </div>;
            }
            else {
                actions = [...allActions]
            }

            viewComponent = [
                oldActionNotice,
                <ActionList actionList={ {items: actions} }
                    key="actionList"
                    bulkSelection={ data.selection }
                    allowBulkSelection={ true }
                    onItemSelect={ this.onItemSelect.bind(this) }
                    onItemClick={ (item, ev) => this.onSelectAction(item.data, ev) }/>
            ]
        }

        return viewComponent;
    }

    getPaneTools(data) {
        const viewStates = {
            'cal': 'panes.allActions.viewModes.calendar',
            'list': 'panes.allActions.viewModes.list'
        };

        let tools = [
            <ViewSwitch key="viewSwitch" states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ this.onViewSwitch.bind(this) }/>,
            <Button key="addButton"
                className="allActionsPane-addButton"
                labelMsg="panes.allActions.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
            <Button key="importButton"
                className="AllActionsPane-importButton"
                labelMsg="panes.allActions.importButton"
                onClick={ this.onImportClick.bind(this) }/>,
        ];

        if (data.selection && data.selection.selectedIds.length) {
            let ops = [ 'export', ];

            tools.push(
                <BulkOpSelect key="bulkOps"
                    objectType="action"
                    openPane={ this.openPane.bind(this) }
                    selection={ data.selection }
                    operations={ ops }/>
            );
        }

        return tools;
    }

    onItemSelect(item, selected) {
        let selectionId = this.bulkSelectionId;
        if (!selectionId) {
            let action = createSelection('bulk', null, null);
            selectionId = action.payload.id;

            this.bulkSelectionId = selectionId
            this.props.dispatch(action);
        }

        if (selected) {
            this.props.dispatch(addToSelection(selectionId, item.data.id));
        }
        else {
            this.props.dispatch(removeFromSelection(selectionId, item.data.id));
        }
    }

    onViewSwitch(state) {
        this.setState({
            viewMode: state
        });
    }

    onImportClick() {
        this.openPane('importactions');
    }

    onAddClick() {
        this.openPane('addaction');
    }

    onShowOldClick() {
        console.log('show old');
        this.setState({
            showOldActions: true
        });
    }
}
