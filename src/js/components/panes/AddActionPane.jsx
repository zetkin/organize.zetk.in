import React from 'react/addons';

import PaneBase from './PaneBase';
import ActionForm from '../forms/ActionForm';


export default class AddActionPane extends PaneBase {
    getPaneTitle(data) {
        return "Add action";
    }

    renderPaneContent(data) {
        const initialData = {
            campaign: {
                id: this.getParam(0, 0)
            },
            location: { id: 0 },
            activity: { id: 0 }
        };

        const dateParam = this.getParam(1);
        if (dateParam) {
            const date = new Date(dateParam);

            date.setHours(9);
            initialData.start_time = date.toISOString();

            date.setHours(11);
            initialData.end_time = date.toISOString();
        }

        return (
            <ActionForm ref="actionForm" action={ initialData }
                onCreateCampaign={ this.onCreateCampaign.bind(this) }
                onCreateLocation={ this.onCreateLocation.bind(this) }
                onCreateActivity={ this.onCreateActivity.bind(this) }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.actionForm.getValues();
        const campaignId = values.campaign_id;

        this.getActions('action')
            .createAction(campaignId, values)
            .then(this.closePane.bind(this));
    }

    onCreateCampaign(title) {
        this.openPane('addcampaign', title);
    }

    onCreateLocation(title) {
        this.openPane('addlocation', title);
    }

    onCreateActivity(title) {
        this.openPane('addactivity', title);
    }
}
