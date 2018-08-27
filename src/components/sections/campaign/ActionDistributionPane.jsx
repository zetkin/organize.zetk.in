import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import ActionDistribution from '../../misc/actiondistro/ActionDistribution';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { retrieveCampaigns } from '../../../actions/campaign';
import { retrieveActivities } from '../../../actions/activity';
import { retrieveLocations } from '../../../actions/location';
import {
    clearActionHighlights,
    highlightActionActivity,
    highlightActionActivityPhase,
    highlightActionLocation,
    highlightActionLocationPhase,
    retrieveActions,
} from '../../../actions/action';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => ({
    actions: state.actions,
    campaigns: state.campaigns,
    activityList: state.activities.activityList,
    locationList: state.locations.locationList,
    filteredActionList: filteredActionList(state)
});

@connect(mapStateToProps)
export default class ActionDistributionPane extends CampaignSectionPaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.filteredActionList) {
            this.props.dispatch(retrieveActions());
            this.props.dispatch(retrieveActivities());
            this.props.dispatch(retrieveLoations());
            this.props.dispatch(retrieveCampaigns());
        }
    }

    renderPaneTop() {
        let actionList = this.props.filteredActionList;

        if (actionList && actionList.items) {
            let actions = actionList.items.map(i => i.data);

            return <ActionMiniCalendar actions={ actions }
                        onSelectDay={ this.onSelectDay.bind(this) }
                        onAddAction={ this.onCalendarAddAction.bind(this) }
                        onMoveAction={ this.onCalendarMoveAction.bind(this) }
                        onSelectAction={ this.onSelectAction.bind(this) }/>
        }
    }

    renderPaneContent() {
        let actionList = this.props.filteredActionList;
        if (actionList && actionList.items) {
            let actions = actionList.items.map(i => i.data);

            return [
                <div key="locations"
                    className="ActionDistributionPane-locations">
                    <Msg tagName="h3" id="panes.actionDistribution.locations.h"/>
                    <ActionDistribution actions={ actions }
                        instanceField="location"
                        onMouseOver={ this.onLocMouseOver.bind(this) }
                        onMouseOverPhase={ this.onLocMouseOverPhase.bind(this) }
                        onMouseOut={ this.onMouseOut.bind(this) }/>
                </div>,
                <div key="activities"
                    className="ActionDistributionPane-activities">
                    <Msg tagName="h3" id="panes.actionDistribution.activities.h"/>
                    <ActionDistribution actions={ actions }
                        instanceField="activity"
                        onMouseOver={ this.onActivityMouseOver.bind(this) }
                        onMouseOverPhase={ this.onActivityMouseOverPhase.bind(this) }
                        onMouseOut={ this.onMouseOut.bind(this) }/>
                </div>
            ];
        }
    }

    onLocMouseOver(loc) {
        this.props.dispatch(highlightActionLocation(loc.id));
    }

    onLocMouseOverPhase(loc, phase) {
        this.props.dispatch(highlightActionLocationPhase(loc.id, phase));
    }

    onActivityMouseOver(activity) {
        this.props.dispatch(highlightActionActivity(activity.id));
    }

    onActivityMouseOverPhase(activity, phase) {
        this.props.dispatch(highlightActionActivityPhase(activity.id, phase));
    }

    onMouseOut() {
        this.props.dispatch(clearActionHighlights());
    }
}
