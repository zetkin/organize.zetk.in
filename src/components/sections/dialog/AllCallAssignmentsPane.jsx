import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import { retrieveCallAssignments } from '../../../actions/callAssignment';


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
            <ul key="assignmentList">
                { data.assignments.items.map(item => {
                    let a= item.data;
                    return (
                        <li onClick={ this.onClickAssignment.bind(this, a) }>
                            { a.title }</li>
                    );
                })}
            </ul>
        );
    }

    onClickAssignment(assignment) {
        this.openPane('callassignment', assignment.id);
    }
}
