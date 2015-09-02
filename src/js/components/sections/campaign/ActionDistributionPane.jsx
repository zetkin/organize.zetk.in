import React from 'react/addons';

import PaneWithCalendar from './PaneWithCalendar';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionDistribution from '../../misc/actiondistro/ActionDistribution';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';


export default class ActionDistributionPane extends PaneWithCalendar {
    getPaneTitle() {
        return 'Location and activity distribution';
    }

    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.getActions('action').retrieveAllActions();
        this.getActions('campaign').retrieveCampaigns();
    }

    renderPaneTop() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return <ActionMiniCalendar actions={ actions }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
    }

    renderPaneContent() {
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions();

        return [
            <CampaignSelect/>,
            <ActionDistribution actions={ actions }
                instanceField="location"
                onMouseOver={ this.onMouseOver.bind(this) }
                onMouseOverPhase={ this.onMouseOverPhase.bind(this) }
                onMouseOut={ this.onMouseOut.bind(this) }/>
        ];
    }

    onMouseOver(loc) {
        this.getActions('action').highlightActionLocation(loc.id);
    }

    onMouseOverPhase(loc, phase) {
        this.getActions('action').highlightActionPhase(loc.id, phase);
    }

    onMouseOut() {
        this.getActions('action').clearActionHighlights();
    }
}
