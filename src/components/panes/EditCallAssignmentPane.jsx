import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CallAssignmentForm from '../forms/CallAssignmentForm';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveCallAssignment, updateCallAssignment }
    from '../../actions/callAssignment';


@connect(state => state)
@injectIntl
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
        const formatMessage = this.props.intl.formatMessage;

        if (data.assignmentItem && !data.assignmentItem.isPending) {
            return formatMessage(
                { id: 'panes.editCallAssignment.title' },
                { title: data.assignmentItem.data.title });
        }
        else {
            return formatMessage(
                { id: 'panes.editCallAssignment.pendingTitle' });
        }
    }

    renderPaneContent(data) {
        if (data.assignmentItem && !data.assignmentItem.isPending) {
            let assignment = data.assignmentItem.data;
            return [
                <CallAssignmentForm key="form" ref="form"
                    assignment={ assignment }
                    onSubmit={ this.onSubmit.bind(this) }/>,
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditCallAssignmentPane-saveButton"
                labelMsg="panes.editCallAssignment.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let assignmentId = this.getParam(0);
        let values = this.refs.form.getChangedValues();

        this.props.dispatch(updateCallAssignment(assignmentId, values));
    }
}
