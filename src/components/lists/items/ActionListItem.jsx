import React from 'react';
import cx from 'classnames';
import { DropTarget } from 'react-dnd';

import ParticipantList from './elements/ParticipantList';
import ContactSlot from './elements/ContactSlot';
import { setActionContact } from '../../../actions/action';
import { retrieveActionResponses } from '../../../actions/actionResponse';
import {
    addActionParticipant,
    moveActionParticipant,
    retrieveActionParticipants,
} from '../../../actions/participant';
import LoadingIndicator from '../../../components/misc/LoadingIndicator';


const actionTarget = {
    canDrop(props, monitor) {
        const person = monitor.getItem();
        const action = props.data;
        const participants = props.participants;
        const duplicate = participants && participants.find(p => (p.id == person.id));

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
                props.dispatch(setActionContact(action.id, person.id));

                if (oldAction && action.id != oldAction.id) {
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

@DropTarget('person', actionTarget, collectParticipant)
@DropTarget('person', contactTarget, collectContact)
export default class ActionListItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        participants: React.PropTypes.array,
        responses: React.PropTypes.array,
        onOperation: React.PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.inView && !prevProps.inView) {
            this.loadSubData();
        }
    }

    componentDidMount() {
        if (this.props.inView) {
            this.loadSubData();
        }
    }

    loadSubData() {
        const { data, participants, responses } = this.props;

        if (!participants) {
            this.props.dispatch(retrieveActionParticipants(data.id));
        }
        if (!responses) {
            this.props.dispatch(retrieveActionResponses(data.id));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        var key;

        if (this.props.inView != nextProps.inView) {
            return true;
        }

        for (key in nextProps) {
            if (key.indexOf('on') !== 0 && nextProps[key] != this.props[key]) {
                return true;
            }
        }

        for (key in nextState) {
            if (nextState[key] != this.state[key]) {
                return true;
            }
        }

        let action = this.props.data;
        if (nextProps.participants != this.props.participants) {
            return true;
        }

        if (nextProps.responses != this.props.responses) {
            return true;
        }

        return false;
    }

    render() {
        let action = this.props.data;
        let participants = this.props.participants || [];
        let responses = this.props.responses || [];
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

        const contactSlot = this.props.connectContactDropTarget(
            <div className="ActionListItem-contactSlot">
                <ContactSlot contact={ contact } action={ action }/>
            </div>
        );

        let bookedParticipants = ( participants.length + "/" + action.num_participants_required );

        const bookingDiff = (action.num_participants_required - participants.length);
        let indicator;

        if (bookingDiff >= 2 || participants.length == 0)
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

        let participantList = this.props.connectParticipantDropTarget(
            <div className="ActionListItem-participantList">
                <ParticipantList action={ action }
                                 maxVisible={ large? participants.length : 4 }
                                 onShowAll={ this.onShowAllParticipants.bind(this) }
                                 participants={ filteredParticipants }/>
            </div>
        );
        let notifier = (
            <div className="ActionListItem-notifier">
                { incomingResponses }
                <div className={ reminderClasses }>
                    <i className="fa fa-bell-o"></i>
                </div>
            </div>);

        if(action.isParticipantsPending){
            participantList = (
                <div className="ActionListItem-participantList">
                    <LoadingIndicator/>
                </div>
            );
        }

        return (
            <div className={ classNames }
                onClick={ this.onClick.bind(this) }>

                <div className="ActionListItem-date">
                    <span className="date">
                        { actionDate.toDateString() }</span>
                    <span className="time">
                        { actionDate.toISOString().substr(11,5) }</span>
                </div>
                <div className="ActionListItem-info">
                    <h3 className="activity">
                        { action.title ? action.title : action.activity.title }</h3>
                    <span className="location">
                        { action.location.title }</span>
                </div>

                { contactSlot }
                { participantList }

                <div className={ bookedParticipantsClasses }>
                    { bookedParticipants }
                </div>

                { notifier }
            </div>
        );
    }

    onClick(ev) {
        this.props.onItemClick(ev);
    }

    onShowAllParticipants(ev) {
        ev.stopPropagation();
        this.setState({
            expanded: true
        });
    }
}
