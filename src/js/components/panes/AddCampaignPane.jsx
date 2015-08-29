import React from 'react/addons';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';


export default class AddCampaignPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add campagin';
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <CampaignForm ref="form" campaign={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();

        // Show indicator
        this.getActions('campaign')
            .createCampaign(values)
            .then(this.onCreateCampaignComplete.bind(this));
    }

    onCreateCampaignComplete () {
        // Todo: Go to edit pane? close?
        this.closePane();
    }
}
