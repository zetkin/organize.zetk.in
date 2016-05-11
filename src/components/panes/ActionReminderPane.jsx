import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Form from '../forms/Form';
import TextArea from '../forms/inputs/TextArea';
import Avatar from '../misc/Avatar';
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
        return data.actionItem?
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
                <h3>Rend reminders to participants</h3>,
                <ul key="newParticipantsList"
                    className="ActionReminderPane-newParticipants">
                {data.newParticipants.map(function(participant) {
                    return <li><Avatar person={ participant }/></li>;
                })}
                </ul>,
                <Form key="reminderForm" ref="reminderForm"
                    onSubmit={ this.onRemindersSubmit.bind(this) }>
                    <TextArea name="message" label="Custom additional info"/>
                    <input type="submit" value="Send all"/>
                </Form>
            ];
        }

        var remindedList = null;
        if (data.remindedParticipants.length) {
            remindedList = [
                <h3>Reminders sent</h3>,
                <ul key="remindedList" className="ActionReminderPane-reminded">
                {data.remindedParticipants.map(function(participant) {
                    const timeLabel = Date.utc.create(participant.reminder_sent)
                        .format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}');

                    const onClick = this.onPersonClick.bind(this, participant);

                    return (
                        <li>
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

    onRemindersSubmit(ev) {
        ev.preventDefault();
        let actionId = this.getParam(0);
        this.props.dispatch(sendActionReminders(actionId));
    }

    onPersonClick(person) {
        this.openPane('person', person.id);
    }
}
