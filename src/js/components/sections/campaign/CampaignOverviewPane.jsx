import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';

import CampaignSelect from '../../misc/CampaignSelect';


export default class CampaignOverviewPane extends PaneBase {
    getPaneTitle() {
        return 'Campaign overview';
    }

    renderPaneContent() {
        return [
            <CampaignSelect/>
        ];
    }
}
