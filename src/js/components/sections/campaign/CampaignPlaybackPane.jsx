import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';


export default class CampaignPlaybackPane extends PaneBase {
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

    renderPaneContent() {
        const actionStore = this.getStore('action');
        const locationStore = this.getStore('location');
        const actions = actionStore.getActions();
        const locations = locationStore.getLocations();

        const center = locationStore.getAverageCenterOfLocations();

        return [
            <CampaignSelect key="select"/>,
            <CampaignPlayer key="player"
                actions={ actions } locations={ locations }
                centerLat={ center.lat } centerLng={ center.lng }/>
        ];
    }
}
