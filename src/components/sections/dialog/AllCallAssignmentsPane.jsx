import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import { retrieveCallAssignments } from '../../../actions/callAssignment';

import CallAssignmentList from '../../lists/CallAssignmentList'


@connect(state => state)
export default class AllCallAssignmentsPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCallAssignments());
    }

    getRenderData() {
        return {
            assignmentList: this.props.callAssignments.assignmentList,
        };
    }

    renderPaneContent(data) {
        return (
            <CallAssignmentList
                callAssignmentList={ data.assignmentList }
                onSelect={ this.onClickAssignment.bind(this) } />
        );
    }

    onClickAssignment(assignment) {
        this.openPane('callassignment', assignment.data.id);
    }
}
