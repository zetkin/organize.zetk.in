import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionDistribution from '../../misc/actiondistro/ActionDistribution';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { retrieveCampaigns } from '../../../actions/campaign';


@connect(state => state)
export default class ActionDistributionPane extends CampaignSectionPaneBase {
    getPaneTitle() {
        return 'Location and activity distribution';
    }

    componentDidMount() {
        super.componentDidMount();

        this.listenTo('action', this.forceUpdate);
        this.getActions('action').retrieveAllActions();

        this.props.dispatch(retrieveCampaigns());
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
            <div className="ActionDistributionPane-locations">
                <h3>Locations</h3>
                <ActionDistribution actions={ actions }
                    instanceField="location"
                    onMouseOver={ this.onLocMouseOver.bind(this) }
                    onMouseOverPhase={ this.onLocMouseOverPhase.bind(this) }
                    onMouseOut={ this.onMouseOut.bind(this) }/>
            </div>,
            <div className="ActionDistributionPane-activities">
                <h3>Activities</h3>
                <ActionDistribution actions={ actions }
                    instanceField="activity"
                    onMouseOver={ this.onActivityMouseOver.bind(this) }
                    onMouseOverPhase={ this.onActivityMouseOverPhase.bind(this) }
                    onMouseOut={ this.onMouseOut.bind(this) }/>
            </div>
        ];
    }

    getPaneTools(data) {
        return (
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>
        );
    }

    onLocMouseOver(loc) {
        this.getActions('action').highlightActionLocation(loc.id);
    }

    onLocMouseOverPhase(loc, phase) {
        this.getActions('action').highlightActionLocationPhase(loc.id, phase);
    }

    onActivityMouseOver(activity) {
        this.getActions('action').highlightActionActivity(activity.id);
    }

    onActivityMouseOverPhase(activity, phase) {
        this.getActions('action').highlightActionActivityPhase(activity.id, phase);
    }

    onMouseOut() {
        this.getActions('action').clearActionHighlights();
    }
}
