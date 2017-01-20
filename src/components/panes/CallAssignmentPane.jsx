import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import Link from '../misc/Link';
import PaneBase from './PaneBase';
import PersonCollection from '../misc/personcollection/PersonCollection';
import { PCCallerItem } from '../misc/personcollection/items';
import ProgressBar from '../misc/ProgressBar';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { createTextDocument } from '../../actions/document';
import {
    updateCallAssignment,
    addCallAssignmentCallers,
    removeCallAssignmentCaller,
    retrieveCallAssignment,
    retrieveCallAssignmentCallers,
    retrieveCallAssignmentStats,
} from '../../actions/callAssignment';


@connect(state => state)
@injectIntl
export default class CallAssignmentPane extends PaneBase {
    componentDidMount() {
        let assignmentId = this.getParam(0);
        this.props.dispatch(retrieveCallAssignment(assignmentId));
        this.props.dispatch(retrieveCallAssignmentStats(assignmentId));
        this.props.dispatch(retrieveCallAssignmentCallers(assignmentId));
    }

    componentWillReceiveProps(nextProps) {
        let assignmentId = this.getParam(0);
        let assignmentList = nextProps.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        if (assignmentItem && assignmentItem.data
            && !assignmentItem.data.statsItem) {
            // If there are no stats for this assignment, e.g. because they
            // were removed by some operation that invalidated them, retrieve
            // call assignment statistics anew.
            this.props.dispatch(retrieveCallAssignmentStats(assignmentId));
        }
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        if (data.assignmentItem && data.assignmentItem.data.title) {
            return data.assignmentItem.data.title;
        }
        else {
            return formatMessage({ id: 'panes.callAssignment.title' });
        }
    }

    renderPaneContent(data) {
        const formatMessage = this.props.intl.formatMessage;

        if (data.assignmentItem) {
            let assignment = data.assignmentItem.data;
            let instructions = assignment.instructions;

            let targetStats = null;
            let goalStats = null;
            let progress = 0.05;
            if (!assignment.statsItem || assignment.statsItem.isPending) {
                targetStats = <LoadingIndicator/>;
                goalStats = <LoadingIndicator/>;
            }
            else {
                let stats = assignment.statsItem.data;
                targetStats = [
                    <h1 key="targetStatsHeader">
                        { stats.num_target_matches }</h1>,
                    <Msg key="targetStatsInfo"
                        id="panes.callAssignment.target.stats.target"/>,
                ];

                goalStats = [
                    <h1 key="goalStatsHeader">
                        { stats.num_remaining_targets }</h1>,
                    <Msg key="goalStatsInfo"
                        id="panes.callAssignment.target.stats.goal"/>,
                ];

                progress = (1 - stats.num_remaining_targets / stats.num_target_matches);
            }

            if (data.queryItem && data.queryItem.data.matchList) {
                targetContent = <h1>{ data.queryItem.data.matchList.items.length }</h1>;
            }

            let callerContent = null;
            if (assignment.callerList) {
                let callers = assignment.callerList.items.map(i => i.data);
                callerContent = (
                    <PersonCollection items={ callers }
                        itemComponent={ PCCallerItem }
                        selectLinkMsg="panes.callAssignment.callers.selectLink"
                        addPersonMsg="panes.callAssignment.callers.addCaller"
                        dispatch={ this.props.dispatch }
                        openPane={ this.openPane.bind(this) }
                        onAdd={ this.onAddCallers.bind(this) }
                        onSelect={ this.onSelectCaller.bind(this) }
                        onRemove={ this.onRemoveCaller.bind(this) }/>
                );
            }

            let cooldownLabel = formatMessage(
                { id: 'panes.callAssignment.summary.cooldown' },
                { cooldown: assignment.cooldown });

            return [
                <div key="summary"
                    className="CallAssignmentPane-summary">
                    <span className="CallAssignmentPane-summaryDesc">{ assignment.description }</span>
                    <span className="CallAssignmentPane-summaryDate">{ assignment.start_date } - { assignment.end_date }</span>
                    <span className="CallAssignmentPane-summaryCooldown">
                        { cooldownLabel }</span>
                    <Link msgId="panes.callAssignment.summary.editLink"
                        onClick={ this.onClickEditSettings.bind(this) }/>
                </div>,

                <div key="instructions"
                    className="CallAssignmentPane-instructions">
                    <Msg tagName="h3"
                        id="panes.callAssignment.instructions.h"/>
                    <div dangerouslySetInnerHTML={{ __html: instructions }}/>
                    <Link msgId="panes.callAssignment.instructions.editLink"
                        onClick={ this.onClickEditInstructions.bind(this) }/>
                </div>,

                <div key="target"
                    className="CallAssignmentPane-target">
                    <Msg tagName="h3"
                        id="panes.callAssignment.target.h"/>
                    <div className="CallAssignmentPane-stats">
                        <div>
                            <div key="targetStats"
                                className="CallAssignmentPane-targetStats"
                                onClick={ this.onClickEditTarget.bind(this) }>
                                { targetStats }
                            </div>
                        </div>
                        <div>
                            <div key="goalStats"
                                className="CallAssignmentPane-goalStats"
                                onClick={ this.onClickEditGoal.bind(this) }>
                                { goalStats }
                            </div>
                        </div>
                    </div>
                    <Link msgId="panes.callAssignment.target.editTargetLink"
                        onClick={ this.onClickEditTarget.bind(this) }/>
                    <Link msgId="panes.callAssignment.target.editGoalLink"
                        onClick={ this.onClickEditGoal.bind(this) }/>
                    <ProgressBar progress={ progress }/>
                </div>,

                <div key="callers"
                    className="CallAssignmentPane-callers">
                    <Msg tagName="h3"
                        id="panes.callAssignment.callers.h"/>
                    { callerContent }
                </div>
            ];
        }
        else {
            return 'Loading';
        }
    }

    onSelectCaller(caller) {
        let assignmentId = this.getParam(0);

        this.openPane('editcaller', assignmentId, caller.id);
    }

    onRemoveCaller(caller) {
        let assignmentId = this.getParam(0);
        this.props.dispatch(removeCallAssignmentCaller(
            assignmentId, caller.id));
    }

    onAddCallers(ids) {
        let assignmentId = this.getParam(0);
        this.props.dispatch(addCallAssignmentCallers(assignmentId, ids));
    }

    onClickEditSettings(ev) {
        let assignmentId = this.getParam(0);
        this.openPane('editcallassignment', assignmentId);
    }

    onClickEditGoal(ev) {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        this.openPane('editquery', assignmentItem.data.goal.id);
    }

    onClickEditTarget(ev) {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        this.openPane('editquery', assignmentItem.data.target.id);
    }

    onClickEditInstructions(ev) {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);
        let instructions = assignmentItem.data.instructions;

        let action = createTextDocument(instructions, content => {
            let values = {
                instructions: content,
            };

            this.props.dispatch(updateCallAssignment(assignmentId, values));
        });

        this.props.dispatch(action);
        this.openPane('edittext', action.payload.id);
    }
}
