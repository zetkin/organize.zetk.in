import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { getLocationAverage } from '../../../utils/location';
import { retrieveLocations } from '../../../actions/location';


@connect(state => state)
export default class CampaignPlaybackPane extends CampaignSectionPaneBase {
    getPaneTitle() {
        return 'Campaign playback';
    }

    componentDidMount() {
        super.componentDidMount();

        this.listenTo('action', this.forceUpdate);
        this.getActions('action').retrieveAllActions();

        this.props.dispatch(retrieveLocations());
    }

    renderPaneTop() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return <ActionMiniCalendar actions={ actions }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
    }

    renderPaneContent() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        const locList = this.props.locations.locationList;
        const locations = locList.items.map(i => i.data);
        const center = getLocationAverage(locList);

        return (
            <CampaignPlayer key="player"
                actions={ actions } locations={ locations }
                centerLat={ center.lat } centerLng={ center.lng }/>
        );
    }

    getPaneTools() {
        return (
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>
        );
    }
}
