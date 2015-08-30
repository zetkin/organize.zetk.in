import React from 'react/addons';
import cx from 'classnames';
import { DropTarget } from 'react-dnd';

import FluxComponent from '../../FluxComponent';
import ParticipantList from './ParticipantList';
import ContactSlot from './ContactSlot';


const actionTarget = {
    canDrop(props, monitor) {
        const person = monitor.getItem();
        const participants = props.participants;
        const duplicate = participants.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        return {
            targetType: 'participant',
            onMoveParticipant: props.onMoveParticipant,
            newAction: props.action
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
        return {
            targetType: 'contact',
            onMoveParticipant: props.onMoveParticipant,
            onSetContact: props.onSetContact,
            newAction: props.action
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
export default class ActionListItem extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidMount() {
        var action = this.props.action;

        if (!this.props.participants) {
            this.getActions('participant').retrieveParticipants(action.id);
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

        if (nextProps.participants != this.props.participants) {
            return true;
        }

        return false;
    }

    render() {
        const action = this.props.action;
        const contact = action.contact;
        const participants = this.props.participants || [];
        const actionDate = new Date(action.start_time);
        const large = (this.state.expanded || this.props.isParticipantOver);

        const classNames = cx({
            'actionlist-item': true,
            'dragover': this.props.isParticipantOver,
            'expanded': this.state.expanded
        });

        // Exclude contact person (if one exists) from participants
        const filteredParticipants = participants.filter(p =>
            !contact || p.id != contact.id);

        const participantList = this.props.connectParticipantDropTarget(
            <ParticipantList action={ action }
                maxVisible={ large? participants.length : 4 }
                onShowAll={ this.onShowAllParticipants.bind(this) }
                participants={ filteredParticipants }/>
        );

        const contactSlot = this.props.connectContactDropTarget(
            <ContactSlot contact={ contact } action={ action }/>
        );

        const numParticipantRows = Math.ceil(filteredParticipants.length/4);
        const height = large? Math.max(9, 0.5 + numParticipantRows * 5.25) : 6;

        const style = {
            height: height + 'em'
        };

        return (
            <li className={ classNames } style={ style }
                onClick={ this.onClick.bind(this) }>

                <span className="time">
                    { actionDate.toISOString().substr(11,5) }</span>
                <span className="date">
                    { actionDate.toDateString() }</span>
                <span className="activity">
                    { action.activity.title }</span>
                <span className="location">
                    { action.location.title }</span>

                { participantList }
                { contactSlot }

                <ul className="operations">
                    <li className="operation">
                        <a onClick={ this.onEditClick.bind(this) }>
                            Edit</a></li>
                    <li className="operation">
                        <a onClick={ this.onSendClick.bind(this) }>
                            Send reminders</a></li>
                    <li className="operation">
                        <a onClick={ this.onBookClick.bind(this) }>
                            Book all available activists</a></li>
                    <li className="operation">
                        <a onClick={ this.onCancelClick.bind(this) }>
                            Cancel action</a></li>
                </ul>
            </li>
        );
    }

    onClick(ev) {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    onShowAllParticipants(ev) {
        this.setState({
            expanded: true
        });
    }

    onEditClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('edit');
        }
    }

    onSendClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('sendreminders');
        }
    }

    onBookClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('bookall');
        }
    }

    onCancelClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('cancel');
        }
    }
}

ActionListItem.propTypes = {
    action: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array,
    onOperation: React.PropTypes.func
};
