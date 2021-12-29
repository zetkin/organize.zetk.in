import React from 'react';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';
import { retrieveCallAssignments } from '../../../actions/callAssignment';

import CallAssignmentList from '../../lists/CallAssignmentList'

const mapStateToProps = (state, props) => {
    // Only display current org assignments
    // FIXME: This is a temporary fix until a proper UI filter has been implemented
    const list = state.callAssignments.assignmentList;
    const orgId = state.user.activeMembership.organization.id;
    list.items = list.items.filter(i => i.data.organization.id == orgId);

    return {
        assignmentList: list, 
    }
};

@connect(mapStateToProps)
export default class AllCallAssignmentsPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveCallAssignments());
    }

    renderPaneContent(data) {
        return (
            <CallAssignmentList
                callAssignmentList={ this.props.assignmentList }
                onItemClick={ this.onAssignmentClick.bind(this) } />
        );
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="allCallAssignmentsPane-addButton"
                labelMsg="panes.allCallAssignments.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onAddClick() {
        this.openPane('addcallassignment');
    }

    onAssignmentClick(assignment, ev) {
        if (ev && ev.altKey) {
            this.openPane('editcallassignment', assignment.data.id);
        }
        else {
            this.openPane('callassignment', assignment.data.id);
        }
    }
}
