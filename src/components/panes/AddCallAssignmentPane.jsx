import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallAssignmentForm from '../forms/CallAssignmentForm';
import { getListItemById } from '../../utils/store';
import { retrieveCallAssignment, createCallAssignment }
    from '../../actions/callAssignment';


@connect(state => state)
export default class AddCallAssignmentPane extends PaneBase {
    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
        }
    }

    getPaneTitle(data) {
        return 'Create call assignment';
    }

    renderPaneContent(data) {
        let assignment = data.assignmentItem?
            data.assignmentItem.data : undefined;

        return [
            <CallAssignmentForm key="form" ref="form"
                assignment={ assignment }
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
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

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getValues();
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        if (assignmentItem) {
            values.target_filters = assignmentItem.data.target_filters;
            values.goal_filters = assignmentItem.data.goal_filters;
        }

        this.props.dispatch(createCallAssignment(values, assignmentId));
    }
}
