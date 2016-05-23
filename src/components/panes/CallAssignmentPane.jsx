import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallerList from '../misc/callerlist/CallerList';
import { getListItemById } from '../../utils/store';
import { createTextDocument } from '../../actions/document';
import { createSelection } from '../../actions/selection';
import {
    updateCallAssignment,
    addCallAssignmentCallers,
    removeCallAssignmentCaller,
    retrieveCallAssignmentCallers,
    retrieveCallAssignmentStats,
} from '../../actions/callAssignment';


@connect(state => state)
export default class CallAssignmentPane extends PaneBase {
    componentDidMount() {
        let assignmentId = this.getParam(0);
        this.props.dispatch(retrieveCallAssignmentStats(assignmentId));
        this.props.dispatch(retrieveCallAssignmentCallers(assignmentId));
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
        };
    }

    getPaneTitle(data) {
        let title = '';

        if (data.assignmentItem) {
            title += data.assignmentItem.data.title;
        }

        return title;
    }

    renderPaneContent(data) {
        if (data.assignmentItem) {
            let assignment = data.assignmentItem.data;
            let instructions = assignment.instructions;

            let targetContent = null;
            if (assignment.statsItem && !assignment.statsItem.isPending) {
                let stats = assignment.statsItem.data;
                targetContent = [
                    <div key="targetStats"
                        className="CallAssignmentPane-targetStats">
                        <h1>{ stats.num_target_matches }</h1>
                        <span>people make up the target</span>
                    </div>,
                    <div key="goalStats"
                        className="CallAssignmentPane-goalStats">
                        <h1>{ stats.num_remaining_targets }</h1>
                        <span>do not yet meet the goal</span>
                    </div>
                ];
            }
            if (data.queryItem && data.queryItem.data.matchList) {
                targetContent = <h1>{ data.queryItem.data.matchList.items.length }</h1>;
            }

            let callerContent = null;
            if (assignment.callerList) {
                let callers = assignment.callerList.items.map(i => i.data);
                callerContent = (
                    <CallerList callers={ callers }
                        onAdd={ this.onAddCaller.bind(this) }
                        onSelect={ this.onSelectCaller.bind(this) }
                        onRemove={ this.onRemoveCaller.bind(this) }/>
                );
            }

            return [
                <div key="summary"
                    className="CallAssignmentPane-summary">
                    <span className="CallAssignmentPane-summaryDesc">{ assignment.description }</span>
                    <span className="CallAssignmentPane-summaryDate">{ assignment.start_date } - { assignment.end_date }</span>
                    <span className="CallAssignmentPane-summaryCooldown">{ assignment.cooldown } hours</span>
                    <a onClick={ this.onClickEditSettings.bind(this) }>
                        Edit basic settings</a>
                </div>,

                <div key="instructions"
                    className="CallAssignmentPane-instructions">
                    <h3>Instructions to callers</h3>
                    <div dangerouslySetInnerHTML={{ __html: instructions }}/>
                    <a onClick={ this.onClickEditInstructions.bind(this) }>
                        Edit instructions</a>
                </div>,

                <div key="target"
                    className="CallAssignmentPane-target">
                    <h3>Targets</h3>
                    <div className="CallAssignmentPane-stats">
                        { targetContent }
                    </div>
                    <a onClick={ this.onClickEditTarget.bind(this) }>
                        Edit target filters</a>
                    <a onClick={ this.onClickEditGoal.bind(this) }>
                        Edit goal filters</a>
                </div>,

                <div key="callers"
                    className="CallAssignmentPane-callers">
                    <h3>Callers</h3>
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

    onAddCaller(caller) {
        let assignmentId = this.getParam(0);

        if (caller) {
            let ids = [ caller.id ];
            this.props.dispatch(addCallAssignmentCallers(assignmentId, ids));
        }
        else {
            let instructions = 'Select people to be added as callers';

            // TODO: Add existing callers as pre-selection
            let action = createSelection('person', null, instructions, ids => {
                this.props.dispatch(addCallAssignmentCallers(assignmentId, ids));
            });

            this.props.dispatch(action);
            this.openPane('selectpeople', action.payload.id);
        }
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
