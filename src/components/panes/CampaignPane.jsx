import React from 'react';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';


export default class CampaignPane extends PaneBase {
    componentDidMount() {
        this.listenTo('campaign', this.forceUpdate);
    }

    getRenderData() {
        var campaignStore = this.getStore('campaign');
        var campaignId = this.props.params[0];

        return {
            campaign: campaignStore.getCampaign(campaignId)
        }
    }

    getPaneTitle(data) {
        if (data.campaign) {
            return data.campaign.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.campaign) {
            return data.campaign.title;
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }
}
