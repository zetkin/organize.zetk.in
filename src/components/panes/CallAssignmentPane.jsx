import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';


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
        return [
            <div key="summary" className="CallAssignmentPane-summary">
            </div>,
            <div key="instructions" className="CallAssignmentPane-instructions">
            </div>,
            <div key="target" className="CallAssignmentPane-target">
            </div>,
            <div key="callers" className="CallAssignmentPane-callers">
            </div>
        ];
    }
}
