import React from 'react';
import cx from 'classnames';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';

import ParticipantList from './elements/ParticipantList';
import ContactSlot from './elements/ContactSlot';
import { updateAction } from '../../../actions/action';
import { retrieveActionResponses } from '../../../actions/actionResponse';
import {
    addActionParticipant,
    moveActionParticipant,
    retrieveActionParticipants,
} from '../../../actions/participant';


const actionTarget = {
    canDrop(props, monitor) {
        const person = monitor.getItem();
        const action = props.data;
        const participants = props.participants.byAction[action.id];
        const duplicate = participants.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        // TODO: Use generalized onDropPerson instead
        let action = props.data;
        return {
            targetType: 'participant',
            onAddParticipant: (person) => {
                props.dispatch(addActionParticipant(
                    action.id, person.id));
            },
            newAction: action,
            onMoveParticipant: (person, oldAction) => {
                props.dispatch(moveActionParticipant(
                    person.id, oldAction.id, action.id));
            },
        };
    }
};

function collectParticipant(connect, monitor) {
    return {
        connectParticipantDropTarget: connect.dropTarget(),
        isParticipantOver: monitor.isOver(),
        canDropParticipant: monitor.canDrop()
    };
}

const contactTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props) {
        // TODO: Use generalized onDropPerson instead
        let action = props.data;
        return {
            targetType: 'contact',
            newAction: action,
            onMoveParticipant: props.onMoveParticipant,
            onSetContact: (person, oldAction) => {
                props.dispatch(updateAction(action.id, {
                    contact_id: person.id
                }));

                if (action.id != oldAction.id) {
                    // TODO: Remove from old action
                }
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
    participants: state.participants,
    responses: state.actionResponses,
});

@connect(mapStateToProps)
@DropTarget('person', actionTarget, collectParticipant)
@DropTarget('person', contactTarget, collectContact)
export default class ActionListItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        participants: React.PropTypes.object,
        responses: React.PropTypes.object,
        onOperation: React.PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidMount() {
        let action = this.props.data;
        let participants = this.props.participants.byAction[action.id];
        let responses = this.props.responses.byAction[action.id];

        // TODO: Move to load when first shown (in view)
        if (!participants) {
            this.props.dispatch(retrieveActionParticipants(action.id));
        }
        if (!responses) {
            this.props.dispatch(retrieveActionResponses(action.id));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        var key;

        for (key in nextProps) {
            if (key.indexOf('on') !== 0 && nextProps[key] != this.props[key]) {
                return true;
            }
        }

        for (key in nextProps.action) {
            if (nextProps.action[key] != this.props.action[key]) {
                return true;
            }
        }

        for (key in nextState) {
            if (nextState[key] != this.state[key]) {
                return true;
            }
        }

        let action = this.props.data;
        if (nextProps.participants.byAction[action.id]
            != this.props.participants.byAction[action.id]) {
            return true;
        }

        return false;
    }

    render() {
        let action = this.props.data;
        let participants = this.props.participants.byAction[action.id] || [];
        let responses = this.props.responses.byAction[action.id] || [];
        const contact = action.contact;
        const actionDate = new Date(action.start_time);
        const inPast = (actionDate < (new Date()) ? true : false);
        const large = (this.state.expanded || this.props.isParticipantOver);

        const classNames = cx({
            'ActionListItem': true,
            'dragOver': this.props.isParticipantOver,
            'expanded': this.state.expanded,
            'past': inPast
        });

        // Exclude contact person (if one exists) from participants
        const filteredParticipants = participants.filter(p =>
            !contact || p.id != contact.id);

        const participantList = this.props.connectParticipantDropTarget(
            <div className="ActionListItem-participantList">
                <ParticipantList action={ action }
                    maxVisible={ large? participants.length : 4 }
                    onShowAll={ this.onShowAllParticipants.bind(this) }
                    participants={ filteredParticipants }/>
            </div>
        );

        const contactSlot = this.props.connectContactDropTarget(
            <div className="ActionListItem-contactSlot">
                <ContactSlot contact={ contact } action={ action }/>
            </div>
        );

        const numParticipantRows = Math.ceil(filteredParticipants.length/4);
        const height = large? Math.max(9, 0.5 + numParticipantRows * 5.25) : 6;

        const style = {
            height: height + 'em'
        };

        let bookedParticipants = ( participants.length + "/" + action.num_participants_required );

        const bookingDiff = (action.num_participants_required - participants.length);
        let indicator;

        if (bookingDiff >= 2)
            indicator = 'danger';
        else if (bookingDiff >= 1)
            indicator = 'low';
        else if (bookingDiff <= 0)
            indicator = 'safe';

        var bookedParticipantsClasses = cx(
            'bookedParticipants',
            indicator
        );

        let incomingResponses;

        if (responses) {
            responses = responses.filter(r =>
                !participants.find(p => p.id == r.id));
        }

        if (responses.length) {
            incomingResponses = (
                <div className="incomingResponses">
                    <i className="fa fa-inbox"></i>
                </div>
            );
        }

        const sentReminders = participants.filter(p =>
            p.reminder_sent != null);

        var reminderStatus = '';

        if (sentReminders.length == participants.length
                && participants.length > 0) {
            reminderStatus = 'sent';
        }
        else if (inPast) {
            reminderStatus = 'missed'
        }
        else {
            reminderStatus = 'left';
        }

        var reminderClasses = cx(
            'reminders',
            reminderStatus
        );

        return (
            <div className={ classNames } style={ style }
                onClick={ this.onClick.bind(this) }>

                <div className="ActionListItem-date">
                    <span className="date">
                        { actionDate.toDateString() }</span>
                    <span className="time">
                        { actionDate.toISOString().substr(11,5) }</span>
                </div>
                <div className="ActionListItem-info">
                    <h3 className="activity">
                        { action.activity.title }</h3>
                    <span className="location">
                        { action.location.title }</span>
                </div>

                { contactSlot }
                { participantList }
                <div className="ActionListItem-actionStatuses">
                </div>
                <div className="ActionListItem-participantStatuses">
                    <div className={ bookedParticipantsClasses }>
                        { bookedParticipants }
                    </div>
                    { incomingResponses }
                    <div className={ reminderClasses }>
                        <i className="fa fa-bell-o"></i>
                    </div>
                </div>
            </div>
        );
    }

    onClick(ev) {
        this.props.onItemClick();
    }

    onShowAllParticipants(ev) {
        ev.stopPropagation();
        this.setState({
            expanded: true
        });
    }
}
