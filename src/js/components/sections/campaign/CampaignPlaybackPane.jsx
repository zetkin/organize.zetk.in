import React from 'react/addons';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';


export default class CampaignPlaybackPane extends CampaignSectionPaneBase {
    getPaneTitle() {
        return 'Campaign playback';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.listenTo('location', this.forceUpdate);
        this.getActions('action').retrieveAllActions();
        this.getActions('location').retrieveLocations();
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
        const locationStore = this.getStore('location');
        const actions = actionStore.getActions();
        const locations = locationStore.getLocations();

        const center = locationStore.getAverageCenterOfLocations();

        return [
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>,
            <CampaignPlayer key="player"
                actions={ actions } locations={ locations }
                centerLat={ center.lat } centerLng={ center.lng }/>
        ];
    }
}
