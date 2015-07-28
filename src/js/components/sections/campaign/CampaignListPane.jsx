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
                {campaigns.map(function(campaign) {
                    return (
                        <li key={ campaign.id }>{ campaign.title }</li>
                    );
                })}
            </ul>
        );
    }
}
