import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import CampaignSelect from '../../misc/CampaignSelect';


export default class AllActionsPane extends PaneBase {
    getPaneTitle() {
        return 'Campaign locations';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.getActions('action').retrieveAllActions();
    }

    renderPaneContent() {
        return [
            <CampaignSelect/>
        ];
    }
}
