import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { createTextDocument } from '../../actions/document';
import { updateCallAssignment } from '../../actions/callAssignment';


@connect(state => state)
export default class CallAssignmentPane extends PaneBase {
    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
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
