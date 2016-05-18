import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallAssignmentForm from '../forms/CallAssignmentForm';
import { getListItemById } from '../../utils/store';
import { retrieveCallAssignment, updateCallAssignment }
    from '../../actions/callAssignment';


@connect(state => state)
export default class EditCallAssignmentPane extends PaneBase {
    componentDidMount() {
        let assignmentId = this.getParam(0);
        this.props.dispatch(retrieveCallAssignment(assignmentId));
    }

    getRenderData() {
        let assignmentId = this.getParam(0);
        let assignmentList = this.props.callAssignments.assignmentList;

        return {
            assignmentItem: getListItemById(assignmentList, assignmentId),
        };
    }

    getPaneTitle(data) {
        if (data.assignmentItem && !data.assignmentItem.isPending) {
            return 'Edit assignment: ' + data.assignmentItem.data.title;
        }
        else {
            return 'Edit assignment';
        }
    }

    renderPaneContent(data) {
        if (data.assignmentItem) {
            let assignment = data.assignmentItem.data;
            return [
                <CallAssignmentForm key="form" ref="form"
                    assignment={ assignment }
                    onSubmit={ this.onSubmit.bind(this) }/>,
            ];
        }
        else {
            // TODO: Loading indicator
            return 'Loading...';
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let assignmentId = this.getParam(0);
        let values = this.refs.form.getChangedValues();

        this.props.dispatch(updateCallAssignment(assignmentId, values));
    }
}
