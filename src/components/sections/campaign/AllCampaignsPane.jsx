import React from 'react';
import { connect } from 'react-redux';

import Button from "../../misc/Button";
import CampaignList from "../../lists/CampaignList";
import CampaignListItem from "../../lists/items/CampaignListItem";
import RootPaneBase from '../RootPaneBase';

const mapStateToProps = state => ({
    campaigns: state.campaigns
});

@connect(mapStateToProps)
export default class AllCampaignsPane extends RootPaneBase {
    constructor() {
        super();
    }

    getPaneTools(data) {
        return <Button className="AllCampaignsPane-addButton"
                labelMsg="panes.allCampaigns.addButton"
                onClick={ this.onCreateCampaign.bind(this) }/>;
    }

    onEditCampaign(campaign) {
        this.openPane('editcampaign', campaign.data.id);
    }

    onCreateCampaign() {
        this.openPane('addcampaign');
    }

    renderPaneContent() {
        return <CampaignList className="CampaignList"
            campaignList={ this.props.campaigns.campaignList }
            onItemClick={ this.onEditCampaign.bind(this) }
        />
    }
}
