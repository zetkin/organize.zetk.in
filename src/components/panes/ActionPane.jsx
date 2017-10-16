import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import cx from 'classnames';

import Button from '../misc/Button';
import ActionBox from '../misc/ActionBox';
import Link from '../misc/Link';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import PersonCollection from '../misc/personcollection/PersonCollection';
import { getListItemById } from '../../utils/store';
import { retrieveAction, updateAction, setActionContact } from '../../actions/action';
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
import InfoList from '../misc/InfoList';


const mapStateToProps = (state, props) => {
    let actionId = props.paneData.params[0];

    return {
        actionItem: getListItemById(state.actions.actionList, actionId),
        actionParticipants: state.participants.byAction[actionId],
        actionResponses: state.actionResponses.byAction[actionId],
    }
};


@connect(mapStateToProps)
@injectIntl
export default class ActionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let actionId = this.getParam(0);

        this.props.dispatch(retrieveAction(actionId));

        if (!this.props.actionParticipants) {
            this.props.dispatch(retrieveActionParticipants(actionId));
        }

        if (!this.props.actionResponses) {
            this.props.dispatch(retrieveActionResponses(actionId));
        }
    }

    getRenderData() {
        return {
            actionItem: this.props.actionItem,
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

            let startDate = Date.create(action.start_time);
            let endDate = Date.create(action.end_time);

            let dateLabel = startDate.setUTC(true)
                .format('{yyyy}-{MM}-{dd}');

            let startTime = startDate.setUTC(true)
                .format('{HH}:{mm}');
            let endTime = endDate.setUTC(true)
                .format('{HH}:{mm}');
            let timeLabel = startTime + " - " + endTime;

            let participants = this.props.actionParticipants;
            let responses = this.props.actionResponses;
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

            let reminderActionBox = null;

            if (participants && participants.length) {
                let reminderStatus = "checked";
                let reminderStatusMsg = null;
                let reminderButton = null;

                if (participants.find(p => !p.reminder_sent)) {
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

                reminderActionBox = (
                    <ActionBox key="action"
                        status={ reminderStatus }
                        headerMsg="panes.action.reminders.h"
                        content={ reminderStatusMsg }
                        footer={ reminderButton } />
                );
            }

            return [
                <InfoList key="summary-infolist"
                    data={[{
                        name: 'desc',
                        value: action.info_text,
                        msgId: 'panes.action.summary.noDesc'
                    }, {
                        name: 'date',
                        value: dateLabel
                    }, {
                        name: 'time',
                        value: timeLabel
                    }, {
                        name: 'location',
                        value: action.location.title
                    }, {
                        name: 'activity',
                        value: action.activity.title
                    }, {
                        name: 'editLink',
                        msgId: 'panes.action.editLink',
                        onClick: this.onClickEdit.bind(this)
                    }]}
                />,

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
                    <PersonSelectWidget person={ action.contact }
                        onSelect={ this.onContactSelect.bind(this) }/>
                </div>,

                <div key="participants"
                    className="ActionPane-participants">
                    <Msg tagName="h3" id="panes.action.participants.h"/>
                    { participantList }
                </div>,
                <div key="reminders"
                    className="ActionPane-reminders">
                    { reminderActionBox }
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

    onContactSelect(person) {
        let actionId = this.getParam(0);
        if (person) {
            this.props.dispatch(setActionContact(actionId, person.id));
        }
        else {
            this.props.dispatch(updateAction(actionId, { contact_id: null }));
        }
    }
}
