import React from 'react';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
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
                onItemClick={ this.onClickAssignment.bind(this) } />
        );
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="AllCallAssignmentsPane-addButton"
                labelMsg="panes.allCallAssignments.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onAddClick() {
        this.openPane('addcallassignment');
    }

    onClickAssignment(assignment) {
        this.openPane('callassignment', assignment.data.id);
    }
}
