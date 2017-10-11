import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CanvassAssignmentForm from '../forms/CanvassAssignmentForm';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import {
    updateCanvassAssignment,
}
from '../../actions/canvassAssignment';


const mapStateToProps = (state, props) => {
    let assignmentList = state.canvassAssignments.assignmentList;
    let assignmentId = props.paneData.params[0];

    return {
        assignmentItem: getListItemById(assignmentList, assignmentId),
    };
};

@connect(mapStateToProps)
@injectIntl
export default class EditCanvassAssignmentPane extends PaneBase {
    getRenderData() {
        return {
            assignmentItem: this.props.assignmentItem,
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        if (data.assignmentItem && !data.assignmentItem.isPending) {
            return formatMessage(
                { id: 'panes.editCanvassAssignment.title' },
                { title: data.assignmentItem.data.title });
        }
        else {
            return formatMessage(
                { id: 'panes.editCanvassAssignment.pendingTitle' });
        }
    }

    renderPaneContent(data) {
        if (data.assignmentItem && !data.assignmentItem.isPending) {
            let assignment = data.assignmentItem.data;
            return [
                <CanvassAssignmentForm key="form" ref="form"
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
            <Button className="EditCanvassAssignmentPane-saveButton"
                labelMsg="panes.editCanvassAssignment.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let assignmentId = this.getParam(0);
        let values = this.refs.form.getChangedValues();

        this.props.dispatch(updateCanvassAssignment(assignmentId, values));
        this.closePane();
    }
}
