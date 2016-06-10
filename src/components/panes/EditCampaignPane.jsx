import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';
import { getListItemById } from '../../utils/store';
import { retrieveCampaign, updateCampaign, deleteCampaign }
    from '../../actions/campaign';


@connect(state => state)
export default class EditCampaignPane extends PaneBase {
    componentDidMount() {
        let campaignId = this.getParam(0);
        let campaignItem = getListItemById(
            this.props.campaigns.campaignList, campaignId);

        if (!campaignItem) {
            this.props.dispatch(retrieveCampaign(campaignId));
        }
    }

    getRenderData() {
        let campaignList = this.props.campaigns.campaignList;
        var campaignId = this.getParam(0);

        return {
            campaignItem: getListItemById(campaignList, campaignId),
        }
    }

    getPaneTitle(data) {
        return 'Edit campaign';
    }

    renderPaneContent(data) {
        if (data.campaignItem) {
            return [
                <CampaignForm key="form" ref="form"
                    campaign={ data.campaignItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <input key="delete" type="button" value="Delete"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const campaignId = this.getParam(0);

        this.props.dispatch(updateCampaign(campaignId, values));
    }

    onDeleteClick(ev) {
        const campaignId = this.getParam(0);

        this.props.dispatch(deleteCampaign(campaignId));
        this.closePane();
    }
}
