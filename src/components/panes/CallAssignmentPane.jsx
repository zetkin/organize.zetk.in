import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { createTextDocument } from '../../actions/document';
import { updateCallAssignment } from '../../actions/callAssignment';
import { retrieveQueryMatches } from '../../actions/query';


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
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        let queryItem = null;
        if (assignmentItem) {
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
                </div>
            ];
        }
        else {
            return 'Loading';
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

            // TODO: Update assignment
            this.props.dispatch(updateCallAssignment(assignmentId, values));
        });

        this.props.dispatch(action);
        this.openPane('edittext', action.payload.id);
    }
}
