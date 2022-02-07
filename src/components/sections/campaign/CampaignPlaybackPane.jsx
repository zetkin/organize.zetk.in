import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { getLocationAverage } from '../../../utils/location';
import { retrieveActions } from '../../../actions/action';
import { retrieveCampaigns } from '../../../actions/campaign';
import { retrieveLocations } from '../../../actions/location';
import { retrieveActivities } from '../../../actions/activity';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => {
    // FIXME: This is a temporary fix until a proper UI filter has been implemented
    const orgId = state.user.activeMembership.organization.id;

    const actions = state.actions;
    if(actions.actionList && !actions.actionList.isPending) {
        actions.actionList.items = actions.actionList.items.filter(i => i.data.organization.id == orgId);
    }

    const campaigns = state.campaigns;
    if(campaigns.campaignList && !campaigns.campaignList.isPending) {
        campaigns.campaignList.items = campaigns.campaignList.items.filter(i => i.data.organization.id == orgId);
    }

    const activityList = state.activities.activityList;
    activityList.items = activityList.items.filter(i => i.data.organization.id == orgId);

    const locationList = state.locations.locationList;
    locationList.items = locationList.items.filter(i => i.data.organization.id == orgId);

    return {
        actions: actions,
        campaigns: campaigns,
        activityList: activityList,
        locationList: locationList,
        filteredActionList: filteredActionList(state)
    }
};

@connect(mapStateToProps)
export default class CampaignPlaybackPane extends CampaignSectionPaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.filteredActionList) {
            this.props.dispatch(retrieveActions());
            this.props.dispatch(retrieveActivities());
            this.props.dispatch(retrieveCampaigns());
        }

        this.props.dispatch(retrieveLocations());
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

            let locList = this.props.locationList;
            let locations = locList.items.map(i => i.data);

            return (
                <CampaignPlayer key="player"
                    actions={ actions } locations={ locations }
                    />
            );
        }
    }
}
