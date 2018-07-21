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
import InfoList from '../misc/InfoList';


const mapStateToProps = (state, props) => {
    let assignmentId = props.paneData.params[0];
    let assignmentList = state.callAssignments.assignmentList;
    let assignmentItem = getListItemById(assignmentList, assignmentId);

    return {
        assignmentItem
    };
};


@connect(mapStateToProps)
@injectIntl
export default class CallAssignmentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let assignmentId = this.getParam(0);
        this.props.dispatch(retrieveCallAssignment(assignmentId));
    }

    componentWillReceiveProps(nextProps) {
        let assignmentId = this.getParam(0);
        let assignmentItem = nextProps.assignmentItem;

        if (assignmentItem && assignmentItem.data && assignmentItem.data.title
            && !assignmentItem.data.statsItem) {
            // If there are no stats for this assignment, e.g. because they
            // were removed by some operation that invalidated them, retrieve
            // call assignment statistics anew.
            this.props.dispatch(retrieveCallAssignmentStats(assignmentId));
        }

        if (assignmentItem && assignmentItem.data && assignmentItem.data.title
            && !assignmentItem.data.callerList) {
            this.props.dispatch(retrieveCallAssignmentCallers(assignmentId));
        }
    }

    getRenderData() {
        return {
            assignmentItem: this.props.assignmentItem,
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

        if (data.assignmentItem && data.assignmentItem.isPending) {
            return <LoadingIndicator />;
        }
        else if (data.assignmentItem && data.assignmentItem.data) {
            let assignment = data.assignmentItem.data;
            let instructions = assignment.instructions;

            let targetDetailsLink = null;
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
                        { stats.num_target_matches - stats.num_remaining_targets }</h1>,
                    <Msg key="goalStatsInfo"
                        id="panes.callAssignment.target.stats.goal"/>,
                ];

                progress = (1 - stats.num_remaining_targets / stats.num_target_matches);

                if (stats.num_target_matches < 3000) {
                    targetDetailsLink = (
                        <Link className="CallAssignmentPane-targetDetailLink"
                            msgId="panes.callAssignment.target.targetDetails"
                            onClick={ this.onClickTargetDetails.bind(this) }/>
                    );
                }
                else {
                    targetDetailsLink = (
                        <span className="CallAssignmentPane-targetDetailLink">
                            <Msg id="panes.callAssignment.target.targetDetailsUnavailable"
                                />
                        </span>
                    );
                }
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
                <InfoList key="summary-infolist"
                    data={[
                        { name: 'desc', value: assignment.description },
                        { name: 'date', value: assignment.start_date + ' - ' + assignment.end_date },
                        { name: 'cooldown', value: cooldownLabel },
                        { name: 'editLink', onClick: this.onClickEditSettings.bind(this), msgId: 'panes.callAssignment.summary.editLink' }
                    ]}
                />,

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
                            <Link msgId="panes.callAssignment.target.editTargetLink"
                                onClick={ this.onClickEditTarget.bind(this) }/>
                        </div>
                        <div>
                            <div key="goalStats"
                                className="CallAssignmentPane-goalStats"
                                onClick={ this.onClickEditGoal.bind(this) }>
                                { goalStats }
                            </div>
                            <Link msgId="panes.callAssignment.target.editGoalLink"
                                onClick={ this.onClickEditGoal.bind(this) }/>
                        </div>
                    </div>
                    <ProgressBar progress={ progress }/>
                    { targetDetailsLink }
                </div>,

                <div key="callers"
                    className="CallAssignmentPane-callers">
                    <Msg tagName="h3"
                        id="panes.callAssignment.callers.h"/>
                    { callerContent }
                </div>
            ];
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
        let assignmentItem = this.props.assignmentItem;

        this.openPane('editquery', assignmentItem.data.goal.id);
    }

    onClickEditTarget(ev) {
        let assignmentItem = this.props.assignmentItem;

        this.openPane('editquery', assignmentItem.data.target.id);
    }

    onClickTargetDetails(ev) {
        let assignmentItem = this.props.assignmentItem;

        this.openPane('callassignmenttargets', assignmentItem.data.id);
    }

    onClickEditInstructions(ev) {
        let assignmentItem = this.props.assignmentItem;
        let instructions = assignmentItem.data.instructions;

        let action = createTextDocument(instructions, content => {
            let assignmentId = assignmentItem.data.id;
            let values = {
                instructions: content,
            };

            this.props.dispatch(updateCallAssignment(assignmentId, values));
        });

        this.props.dispatch(action);
        this.openPane('edittext', action.payload.id);
    }
}
