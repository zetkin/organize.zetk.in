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

        return [
            <input type="button" value="Add"
                onClick={ this.onAddClick.bind(this) }/>,
            <ul>
                {campaigns.map(function(c) {
                    return (
                        <li key={ c.id }
                            onClick={ this.onCampaignClick.bind(this, c) }>
                            { c.title }</li>
                    );
                }, this)}
            </ul>
        ];
    }

    onAddClick(ev) {
        this.gotoSubPane('addcampaign');
    }

    onCampaignClick(campaign) {
        this.gotoSubPane('editcampaign', campaign.id);
    }
}
