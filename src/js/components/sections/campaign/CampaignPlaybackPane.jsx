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
        this.getActions('action').retrieveAllActions();
    }

    renderPaneContent() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return [
            <CampaignSelect/>,
            <CampaignPlayer actions={ actions }/>
        ];
    }
}
