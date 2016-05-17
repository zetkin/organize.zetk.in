import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import TagCloud from '../misc/tagcloud/TagCloud';
import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';
import {
    retrieveCallAssignment,
    retrieveCallAssignmentCallers,
    addCallerPrioritizedTags,
    addCallerExcludedTags,
    removeCallerPrioritizedTags,
    removeCallerExcludedTags,
} from '../../actions/callAssignment';


@connect(state => state)
export default class EditCallerPane extends PaneBase {
    componentDidMount() {
        let assignmentId = this.getParam(0);

        this.props.dispatch(retrieveCallAssignment(assignmentId));
        this.props.dispatch(retrieveCallAssignmentCallers(assignmentId));
    }

    getRenderData() {
        let assignmentList = this.props.callAssignments.assignmentList;
        let assignmentId = this.getParam(0);
        let assignmentItem = getListItemById(assignmentList, assignmentId);

        if (assignmentItem && assignmentItem.data.callerList) {
            let callerList = assignmentItem.data.callerList;
            let callerId = this.getParam(1);
            var callerItem = getListItemById(callerList, callerId);
        }

        return { assignmentItem, callerItem };
    }

    getPaneTitle(data) {
        if (data.callerItem) {
            let caller = data.callerItem.data;
            return 'Edit caller: ' + caller.first_name + ' ' + caller.last_name;
        }
        else {
            return 'Edit caller';
        }
    }

    renderPaneContent(data) {
        let prioTags = null;
        let exTags = null;

        if (data.callerItem) {
            let caller = data.callerItem.data;

            prioTags = <TagCloud key="prioTags" tags={ caller.prioritized_tags }
                showAddButton={ true } showRemoveButtons={ true }
                onAdd={ this.onAddTag.bind(this, 'prio') }
                onRemove={ this.onRemovePrioTag.bind(this) }/>;

            exTags = <TagCloud key="exTags" tags={ caller.excluded_tags }
                showAddButton={ true } showRemoveButtons={ true }
                onAdd={ this.onAddTag.bind(this, 'ex') }
                onRemove={ this.onRemoveExTag.bind(this) }/>
        }

        return [
            <h3 key="prioHeader">Prioritized tags</h3>,
            <p key="prioInstructions">
                People with these tags will be prioritized for this caller.
            </p>,
            prioTags,
            <h3 key="exHeader">Excluded tags</h3>,
            <p key="exInstructions">
                This caller will not be calling people with these tags.
            </p>,
            exTags,
        ];
    }

    onAddTag(type) {
        let assignmentId = this.getParam(0);
        let callerId = this.getParam(1);

        let action = createSelection('persontag', null, null, ids => {
            let actionCreator;
            switch (type) {
                case 'prio':  actionCreator = addCallerPrioritizedTags; break;
                case 'ex':    actionCreator = addCallerExcludedTags; break;
            }

            this.props.dispatch(actionCreator(assignmentId, callerId, ids));
        });

        this.props.dispatch(action);
        this.openPane('selectpersontags', action.payload.id);
    }

    onRemovePrioTag(tag) {
        let assignmentId = this.getParam(0);
        let callerId = this.getParam(1);

        this.props.dispatch(removeCallerPrioritizedTags(
            assignmentId, callerId, [ tag.id ]));
    }

    onRemoveExTag(tag) {
        let assignmentId = this.getParam(0);
        let callerId = this.getParam(1);

        this.props.dispatch(removeCallerExcludedTags(
            assignmentId, callerId, [ tag.id ]));
    }
}
