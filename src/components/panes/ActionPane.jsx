import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { DropTarget } from 'react-dnd';
import React from 'react';

import cx from 'classnames';

import Button from '../misc/Button';
import ActionBox from '../misc/ActionBox';
import Link from '../misc/Link';
import ContactSlot from '../lists/items/elements/ContactSlot';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonCollection from '../misc/personcollection/PersonCollection';
import { getListItemById } from '../../utils/store';
import { retrieveAction, setActionContact } from '../../actions/action';
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
                props.dispatch(setActionContact(actionId, person.id));
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

    renderPaneContent(data) {
        if (data.actionItem) {
            let action = data.actionItem.data;

            let descText = null;
            if (action.info_text) {
                descText = action.info_text;
            }
            else {
                descText = this.props.intl.formatMessage(
                    { id: 'panes.action.summary.noDesc' });
            }

            let startDate = Date.create(action.start_time);
            let endDate = Date.create(action.end_time);

            let dateLabel = startDate.setUTC(true)
                .format('{yyyy}-{MM}-{dd}');

            let startTime = startDate.setUTC(true)
                .format('{HH}:{mm}');
            let endTime = endDate.setUTC(true)
                .format('{HH}:{mm}');
            let timeLabel = startTime + " - " + endTime;



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
            else {
                responseList = (
                    <div className="ActionPane-noResponses">
                        <Msg id="panes.action.responses.none"/>
                    </div>
                );
            }

            let contactSlot = this.props.connectContactDropTarget(
                <div className="ActionPane-contactDropTarget">
                    <ContactSlot
                        contact={ action.contact }/>
                        <Msg id="panes.action.contact.addContact"/>
                </div>
            );

            let reminderStatus = "checked";
            let reminderStatusMsg = null;
            let reminderButton = null;

            if (participants &&
                participants.find(p => !p.reminder_sent)) {
                // Not all have reminders yet.
                reminderStatus = "waiting";

                let missingContact = null;

                if (action.contact) {
                    reminderButton = (
                        <Button
                            className="ActionPane-reminderButton"
                            labelMsg="panes.action.reminders.button"
                            onClick={ this.onClickReminders.bind(this) }/>
                    );
                }
                else {
                    missingContact = (
                        <p className="missingContact">
                            <Msg id="panes.action.reminders.missingContact"/>
                        </p>
                    );
                }

                reminderStatusMsg = (
                    <div>
                        <p className={ reminderStatus }>
                            <Msg id="panes.action.reminders.received.notAll"/>
                        </p>
                        { missingContact }
                    </div>
                );
            }
            else {
                // All have reminders
                reminderStatusMsg = (
                    <p className={ reminderStatus }>
                        <Msg id="panes.action.reminders.received.all"/>
                    </p>
                );
            }

            let remindersActionBox = (
                <ActionBox key="action"
                    status={ reminderStatus }
                    header="Reminders"
                    content={ reminderStatusMsg }
                    footer={ reminderButton } />
            );

            return [
                <div key="summary"
                    className="ActionPane-summary">
                    <span className="ActionPane-summaryDesc">
                        { descText }
                    </span>
                    <span className="ActionPane-summaryDate">
                        { dateLabel }
                    </span>
                    <span className="ActionPane-summaryTime">
                        { timeLabel }
                    </span>
                    <span className="ActionPane-summaryLocation">
                        { action.location.title }
                    </span>
                    <span className="ActionPane-summaryActivity">
                        { action.activity.title }
                    </span>
                    <span className="ActionPane-summaryRequired">
                        { action.num_participants_required }
                    </span>
                    <Link msgId="panes.action.editLink"
                        onClick={ this.onClickEdit.bind(this) }/>
                </div>,

                <div key="responses"
                    className="ActionPane-responses">
                    <Msg tagName="h3" id="panes.action.responses.h"/>
                    <div className="ActionPane-responsesGuide">
                        <Msg id="panes.action.responses.guide"/>
                    </div>
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
                <div key="reminders"
                    className="ActionPane-reminders">
                    { remindersActionBox }
                </div>,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
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
