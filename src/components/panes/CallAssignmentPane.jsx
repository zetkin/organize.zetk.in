import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallerList from '../misc/callerlist/CallerList';
import { getListItemById } from '../../utils/store';
import { createTextDocument } from '../../actions/document';
import { retrieveQueryMatches } from '../../actions/query';
import { createSelection } from '../../actions/selection';
import {
    updateCallAssignment,
    addCallAssignmentCallers,
    removeCallAssignmentCaller,
    retrieveCallAssignmentCallers,
} from '../../actions/callAssignment';


@connect(state => state)
export default class CallAssignmentPane extends PaneBase {
    componentDidMount() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        if (assignmentItem) {
            let queryId = assignmentItem.data.target.id;
            this.props.dispatch(retrieveQueryMatches(queryId));
        }

        this.props.dispatch(retrieveCallAssignmentCallers(assignmentId));
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        let queryItem = null;
        if (assignmentItem && assignmentItem.data.target) {
            let queryList = this.props.queries.queryList;
            let queryId = assignmentItem.data.target.id;
            queryItem = getListItemById(queryList, queryId);
        }

        return {
            assignmentItem: assignmentItem,
            queryItem: queryItem,
        };
    }

    getPaneTitle(data) {
        let title = 'Call assignment';

        if (data.assignmentItem) {
            title += ': ' + data.assignmentItem.data.title;
        }

        return title;
    }

    renderPaneContent(data) {
        if (data.assignmentItem) {
            let assignment = data.assignmentItem.data;
            let instructions = assignment.instructions;

            let targetContent = null;
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
                    <h3>Assignment summary</h3>
                    <p>{ assignment.description }</p>
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
                    <div>
                        { targetContent }
                    </div>
                    <a onClick={ this.onClickEditTarget.bind(this) }>
                        Edit target filters</a>
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
