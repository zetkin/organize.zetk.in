import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationForm from '../forms/LocationForm';
import { getListItemById } from '../../utils/store';


@connect(state => state)
export default class CampaignPane extends PaneBase {
    getRenderData() {
        let campaignList = this.props.campaigns.campaignList;
        var campaignId = this.getParam(0);

        return {
            campaignItem: getListItemById(campaignList, campaignId),
        }
    }

    getPaneTitle(data) {
        if (data.campaignItem) {
            return data.campaignItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.campaign) {
            return data.campaignItem.data.title;
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }
}
