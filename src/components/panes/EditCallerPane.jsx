import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
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
@injectIntl
export default class EditCallerPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

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
        const formatMessage = this.props.intl.formatMessage;
        if (data.callerItem) {
            let caller = data.callerItem.data;
            return formatMessage({ id: 'panes.editCaller.title' },
                { firstName: caller.first_name, lastName: caller.last_name });
        }
        else {
            return formatMessage({ id: 'panes.editCaller.pendingTitle' });
        }
    }

    renderPaneContent(data) {
        let firstName = '';
        let prioTags = null;
        let exTags = null;

        if (data.callerItem) {
            let caller = data.callerItem.data;

            firstName = caller.first_name;

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
            <h3 key="prioHeader">
                <i className="fa fa-star"/>
                <Msg id="panes.editCaller.prio.h"/>
            </h3>,
            <Msg tagName="p" key="prioInstructions"
                id="panes.editCaller.prio.instructions"
                values={{ firstName }}/>,
            prioTags,
            <h3 key="exHeader">
                <i className="fa fa-ban"/>
                <Msg id="panes.editCaller.ex.h"/>
            </h3>,
            <Msg tagName="p" key="exInstructions"
                id="panes.editCaller.ex.instructions"
                values={{ firstName }}/>,
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
