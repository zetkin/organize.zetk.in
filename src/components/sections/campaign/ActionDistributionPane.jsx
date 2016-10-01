import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import ActionDistribution from '../../misc/actiondistro/ActionDistribution';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { retrieveCampaigns } from '../../../actions/campaign';
import {
    clearActionHighlights,
    highlightActionActivity,
    highlightActionActivityPhase,
    highlightActionLocation,
    highlightActionLocationPhase,
    retrieveActions,
} from '../../../actions/action';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => ({
    actions: state.actions,
    filteredActionList: filteredActionList(state)
});

@connect(mapStateToProps)
export default class ActionDistributionPane extends CampaignSectionPaneBase {
    getPaneTitle() {
        return 'Location and activity distribution';
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveCampaigns());
    }

    renderPaneTop() {
        let actionList = this.props.filteredActionList;
        let actions = actionList.items.map(i => i.data);

        return <ActionMiniCalendar actions={ actions }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
    }

    renderPaneContent() {
        let actionList = this.props.filteredActionList;
        let actions = actionList.items.map(i => i.data);

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
        this.props.dispatch(highlightActionLocation(loc.id));
    }

    onLocMouseOverPhase(loc, phase) {
        this.props.dispatch(highlightActionLocationPhase(loc.id, phase));
    }

    onActivityMouseOver(activity) {
        this.props.dispatch(highlightActionActivity(activity.id));
    }

    onActivityMouseOverPhase(activity, phase) {
        this.props.dispatch(highlightActionActivityPhase(activity.id, phase));
    }

    onMouseOut() {
        this.props.dispatch(clearActionHighlights());
    }
}
