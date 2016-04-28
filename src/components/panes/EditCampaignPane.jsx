import React from 'react';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';


export default class EditCampaignPane extends PaneBase {
    componentDidMount() {
        this.listenTo('campaign', this.forceUpdate);
    }

    getRenderData() {
        const campaignId = this.props.params[0];
        const campaignStore = this.getStore('campaign');
        return {
            campaign: campaignStore.getCampaign(campaignId)
        }
    }

    getPaneTitle(data) {
        return 'Edit campaign';
    }

    renderPaneContent(data) {
        if (data.campaign) {
            return [
                <CampaignForm key="form" ref="form" campaign={ data.campaign }
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
        const campaignId = this.props.params[0];

        this.getActions('campaign')
            .updateCampaign(campaignId, values)
            .then(this.closePane.bind(this));
    }

    onDeleteClick(ev) {
        const campaignId = this.props.params[0];

        this.getActions('campaign').deleteCampaign(campaignId);
        this.closePane();
    }
}
