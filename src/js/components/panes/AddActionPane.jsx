import React from 'react/addons';

import PaneBase from './PaneBase';
import ActionForm from '../forms/ActionForm';


export default class AddActionPane extends PaneBase {
    getPaneTitle(data) {
        return "Add action";
    }

    renderPaneContent(data) {
        return (
            <ActionForm ref="actionForm"
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.actionForm.getValues();
        const campaignId = values.campaign_id;

        this.getActions('action').createAction(campaignId, values);
    }
}
