import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallAssignmentForm from '../forms/CallAssignmentForm';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import { retrieveCampaigns } from '../../actions/campaign';
import { retrieveCallAssignment, createCallAssignment }
    from '../../actions/callAssignment';

import InformTemplate from '../misc/callAssignmentTemplates/InformTemplate';
import MobilizeTemplate from '../misc/callAssignmentTemplates/MobilizeTemplate';
import StayInTouchTemplate from '../misc/callAssignmentTemplates/StayInTouchTemplate';


@connect(state => state)
@injectIntl
export default class AddCallAssignmentPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            step: 'target',
            targetType: 'all', // TODO: Default to null
            targetConfig: null,
            goalType: null,
            goalConfig: null,
        };
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let campaignList = this.props.campaigns.campaignList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
            campaigns: campaignList.items.map(i => i.data),
        }
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addCallAssignment.title' });
    }

    renderPaneContent(data) {
        let assignment = data.assignmentItem?
            data.assignmentItem.data : undefined;

        if (this.state.step === 'target') {
            return [
                <Msg tagName="p" key="instructions"
                    id="panes.addCallAssignment.target.instructions"/>,
            ];
        }
        else if (this.state.step === 'goal') {
            return [
                <Msg tagName="p" key="instructions"
                    id="panes.addCallAssignment.goal.instructions"/>,
                <div key="templates">
                    <InformTemplate
                        selected={ this.state.goalType == 'inform' }
                        onSelect={ this.onGoalSelect.bind(this) }/>
                    <MobilizeTemplate campaigns={ data.campaigns }
                        selected={ this.state.goalType == 'mobilize' }
                        onSelect={ this.onGoalSelect.bind(this) }/>
                    <StayInTouchTemplate
                        selected={ this.state.goalType == 'stayintouch' }
                        onSelect={ this.onGoalSelect.bind(this) }/>
                </div>,
            ];
        }
        else if (this.state.step === 'form') {
            return [
                <CallAssignmentForm key="form" ref="form"
                    assignment={ assignment }
                    onSubmit={ this.onSubmit.bind(this) }/>,
            ];
        }
    }

    componentDidMount() {
        this.props.dispatch(retrieveCampaigns());
    }

    componentDidUpdate() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        if (assignmentId && assignmentId.charAt(0) == '$' && !assignmentItem) {
            // The pane is referencing a draft that no longer exists
            this.closePane();
        }
    }

    renderPaneFooter(data) {
        let step = this.state.step;
        let msgId = 'panes.addCallAssignment.' + step + '.saveButton';
        let msgValues = {
            goalType: this.state.goalType,
            targetType: this.state.targetType,
        };

        let enabled = true;
        if (step == 'target') {
            enabled = !!this.state.targetType;
        }
        else if (step == 'goal') {
            enabled = !!this.state.goalType;
        }

        // TODO: Style differently instead of just hiding?
        if (enabled) {
            return (
                <Button className="AddCallAssignmentPane-saveButton"
                    labelMsg={ msgId } labelValues={ msgValues }
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    onGoalSelect(type) {
        this.setState({
            goalType: type,
        });
    }

    onSubmit(ev) {
        if (this.state.step == 'target') {
            this.setState({
                step: 'goal',
            });
        }
        else if (this.state.step == 'goal') {
            this.setState({
                step: 'form',
            });
        }
        else if (this.state.step == 'form') {
            ev.preventDefault();

            let values = this.refs.form.getValues();
            let assignmentId = this.getParam(0);
            let assignmentList = this.props.callAssignments.assignmentList;
            let assignmentItem = getListItemById(assignmentList, assignmentId);

            if (assignmentItem) {
                values.target_filters = assignmentItem.data.target_filters;
                values.goal_filters = assignmentItem.data.goal_filters;
            }

            this.props.dispatch(createCallAssignment(
                values, assignmentId, this.props.paneData.id));
        }
    }
}
