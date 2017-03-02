import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { DropTarget } from 'react-dnd';
import React from 'react';

import Button from '../misc/Button';
import Link from '../misc/Link';
import ContactSlot from '../lists/items/elements/ContactSlot';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonCollection from '../misc/personcollection/PersonCollection';
import { getListItemById } from '../../utils/store';
import { retrieveAction, updateAction } from '../../actions/action';
import {
    PCActionParticipantItem,
    PCActionResponseItem,
} from '../misc/personcollection/items';
import { retrieveActionResponses } from '../../actions/actionResponse';
import {
    addActionParticipant,
    addActionParticipants,
    removeActionParticipant,
    retrieveActionParticipants,
} from '../../actions/participant';


const contactTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props) {
        // TODO: Use generalized onDropPerson instead
        let actionId = props.paneData.params[0];

        return {
            targetType: 'contact',
            onSetContact: person => {
                props.dispatch(updateAction(actionId, {
                    contact_id: person.id
                }));
            }
        }
    }
};

function collectContact(connect, monitor) {
    return {
        connectContactDropTarget: connect.dropTarget(),
        isContactOver: monitor.isOver(),
        canDropContact: monitor.canDrop()
    };
}


let mapStateToProps = state => ({
    actions: state.actions,
    actionParticipants: state.participants,
    actionResponses: state.actionResponses,
});


@connect(mapStateToProps)
@DropTarget('person', contactTarget, collectContact)
@injectIntl
export default class ActionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let actionId = this.getParam(0);

        this.props.dispatch(retrieveAction(actionId));

        if (!this.props.actionParticipants.byAction[actionId]) {
            this.props.dispatch(retrieveActionParticipants(actionId));
        }

        if (!this.props.actionResponses.byAction[actionId]) {
            this.props.dispatch(retrieveActionResponses(actionId));
        }
    }

    getRenderData() {
        let actionId = this.getParam(0);
        let actionList = this.props.actions.actionList;

        return {
            actionItem: getListItemById(actionList, actionId),
        }
    }

    getPaneTitle(data) {
        if (data.actionItem && data.actionItem.data && !data.actionItem.isPending) {
            let action = data.actionItem.data;
            return this.props.intl.formatMessage({ id: 'panes.action.title' }, {
                activity: action.activity.title,
            });
        }
        else {
            return null;
        }
    }

    getPaneSubTitle(data) {
        if (data.actionItem && data.actionItem.data && !data.actionItem.isPending) {
            let action = data.actionItem.data;
            let startDate = Date.create(action.start_time);
            let timeLabel = startDate.setUTC(true)
                .format('{yyyy}-{MM}-{dd}, {HH}:{mm}');

            return action.location.title + ', ' + timeLabel;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.actionItem) {
            let action = data.actionItem.data;
            let participants = this.props.actionParticipants.byAction[action.id];
            let responses = this.props.actionResponses.byAction[action.id];
            let participantList;
            let responseList;

            if (participants) {
                participantList = (
                    <PersonCollection items={ participants }
                        itemComponent={ PCActionParticipantItem }
                        selectLinkMsg="panes.action.participants.selectLink"
                        addPersonMsg="panes.action.participants.addPerson"
                        showEditButtons={ false }
                        dispatch={ this.props.dispatch }
                        openPane={ this.openPane.bind(this) }
                        onRemove={ this.onRemoveParticipant.bind(this) }
                        onAdd={ this.onAddParticipants.bind(this) }
                        />
                );

                // Filter responses to not include participants
                if (responses) {
                    responses = responses.filter(r =>
                        !participants.find(p => p.id == r.id));
                }
            }

            if (responses && responses.length) {
                responseList = (
                    <PersonCollection items={ responses }
                        itemComponent={ PCActionResponseItem }
                        showRemoveButtons={ false }
                        showEditButtons={ false }
                        onSelect={ this.onSelectResponse.bind(this) }
                        />
                );
            }

            let contactSlot = this.props.connectContactDropTarget(
                <div className="ActionPane-contactDropTarget">
                    <ContactSlot
                        contact={ action.contact }/>
                </div>
            );

            return [
                <div key="summary"
                    className="ActionPane-summary">
                    <span className="ActionPane-info">
                        { action.info_text }
                    </span>
                    <Link msgId="panes.action.editLink"
                        onClick={ this.onClickEdit.bind(this) }/>
                </div>,

                <div key="responses"
                    className="ActionPane-responses">
                    <Msg tagName="h3" id="panes.action.responses.h"/>
                    { responseList }
                </div>,

                <div key="contact"
                    className="ActionPane-contact">
                    <Msg tagName="h3" id="panes.action.contact.h"/>
                    { contactSlot }
                </div>,

                <div key="participants"
                    className="ActionPane-participants">
                    <Msg tagName="h3" id="panes.action.participants.h"/>
                    { participantList }
                </div>,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="ActionPane-reminderButton"
                labelMsg="panes.action.sendRemindersButton"
                onClick={ this.onClickReminders.bind(this) }/>
        );
    }

    onClickEdit(ev) {
        let actionId = this.getParam(0);
        this.openPane('editaction', actionId);
    }

    onClickReminders(ev) {
        let actionId = this.getParam(0);
        this.openPane('actionreminder', actionId);
    }

    onAddParticipants(ids) {
        let actionId = this.getParam(0);
        this.props.dispatch(addActionParticipants(actionId, ids));
    }

    onSelectResponse(person) {
        let actionId = this.getParam(0);
        this.props.dispatch(addActionParticipant(actionId, person.id));
    }

    onRemoveParticipant(person) {
        let actionId = this.getParam(0);
        this.props.dispatch(removeActionParticipant(actionId, person.id));
    }
}
