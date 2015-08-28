import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionLocations from '../../misc/actionlocations/ActionLocations';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';


export default class AllActionsPane extends PaneBase {
    getPaneTitle() {
        return 'Campaign locations';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.getActions('action').retrieveAllActions();
    }

    renderPaneTop() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return <ActionMiniCalendar actions={ actions }/>
    }

    renderPaneContent() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return [
            <CampaignSelect/>,
            <ActionLocations actions={ actions }/>
        ];
    }
}
