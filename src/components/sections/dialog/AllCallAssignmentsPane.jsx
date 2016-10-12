import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import { retrieveCallAssignments } from '../../../actions/callAssignment';

import CallAssignmentsList from '../../lists/CallAssignmentsList'


@connect(state => state)
export default class AllCallAssignmentsPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCallAssignments());
    }

    getRenderData() {
        return {
            assignments: this.props.callAssignments.assignmentList,
        };
    }

    renderPaneContent(data) {
        return (
            <CallAssignmentsList callAssignmentsList={data.assignments} onSelect={this.onClickAssignment.bind(this)} />
        );
    }

    onClickAssignment(assignment) {
        this.openPane('callassignment', assignment.data.id);
    }
}
