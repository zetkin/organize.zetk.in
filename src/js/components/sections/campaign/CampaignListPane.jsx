import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


export default class CampaignListPane extends PaneBase {
    getPaneTitle() {
        return 'All campaigns';
    }

    componentDidMount() {
        this.listenTo('campaign', this.forceUpdate);
        this.getActions('campaign').retrieveCampaigns();
    }

    renderPaneContent() {
        var campaignStore = this.getStore('campaign');
        var campaigns = campaignStore.getCampaigns();

        return (
            <ul>
                {campaigns.map(function(c) {
                    return (
                        <li key={ c.id }
                            onClick={ this.onCampaignClick.bind(this, c) }>
                            { c.title }</li>
                    );
                }, this)}
            </ul>
        );
    }

    onCampaignClick(campaign) {
        this.gotoSubPane('campaign', campaign.id);
    }
}
