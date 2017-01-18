import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Form from '../forms/Form';
import TextArea from '../forms/inputs/TextArea';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import Person from '../misc/elements/Person';
import Action from '../misc/elements/Action';
import { retrieveAction, sendActionReminders } from '../../actions/action';
import { retrieveActionParticipants } from '../../actions/participant';
import { getListItemById } from '../../utils/store';


@connect(state => state)
export default class ActionReminderPane extends PaneBase {
    getPaneTitle() {
        return 'Action reminders';
    }

    getPaneSubTitle(data) {
        return (data.actionItem && !data.actionItem.isPending)?
            <Action action={ data.actionItem.data }/> : null;
    }

    componentDidMount() {
        let actionId = this.getParam(0);
        this.props.dispatch(retrieveActionParticipants(actionId));
        this.props.dispatch(retrieveAction(actionId));
    }

    getRenderData() {
        let aid = this.getParam(0);
        let participantStore = this.props.participants;
        let participants = participantStore.byAction[aid] || [];

        return {
            actionItem: getListItemById(this.props.actions.actionList, aid),
            remindedParticipants: participants.filter(p => p.reminder_sent),
            newParticipants: participants.filter(p => !p.reminder_sent)
        };
    }

    renderPaneContent(data) {
        var reminderForm = null;
        if (data.newParticipants.length) {
            reminderForm = [
                <Msg key="h" tagName="h3"
                    id="panes.actionReminder.toBeReminded.h"/>,
                <ul key="newParticipantsList"
                    className="ActionReminderPane-newParticipants">
                {data.newParticipants.map(function(participant) {
                    return (
                        <li key={ participant.id }>
                            <Avatar person={ participant }/>
                        </li>
                    );
                })}
                </ul>,
            ];
        }

        var remindedList = null;
        if (data.remindedParticipants.length) {
            remindedList = [
                <Msg key="h" tagName="h3"
                    id="panes.actionReminder.alreadyReminded.h"/>,
                <ul key="remindedList" className="ActionReminderPane-reminded">
                {data.remindedParticipants.map(function(participant) {
                    const timeLabel = Date.utc.create(participant.reminder_sent)
                        .format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}');

                    const onClick = this.onPersonClick.bind(this, participant);

                    return (
                        <li key={ participant.id }>
                            <Avatar person={ participant }/>
                            <Person person={ participant } onClick={ onClick }/>
                            <span className="ActionReminderPane-timestamp">
                                { timeLabel }</span>
                        </li>
                    );
                }, this)}
                </ul>
            ];
        }

        return [
            reminderForm,
            remindedList
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="ActionReminderPane-saveButton"
                labelMsg="panes.actionReminder.saveButton"
                onClick={ this.onRemindersSubmit.bind(this) }/>
        );
    }

    onRemindersSubmit(ev) {
        ev.preventDefault();
        let actionId = this.getParam(0);
        this.props.dispatch(sendActionReminders(actionId));
    }

    onPersonClick(person) {
        this.openPane('person', person.id);
    }
}
