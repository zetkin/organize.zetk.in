import React from 'react';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';

import CampaignSelect from '../../misc/CampaignSelect';


export default class CampaignOverviewPane extends CampaignSectionPaneBase {
    renderPaneContent() {
        return [
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>
        ];
    }
}
