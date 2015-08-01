import React from 'react/addons';
import cx from 'classnames';
import { DropTarget } from 'react-dnd';

import FluxComponent from '../../FluxComponent';
import ParticipantItem from './ParticipantItem';


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
            onMoveParticipant: props.onMoveParticipant,
            newAction: props.action
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@DropTarget('person', actionTarget, collect)
export default class ActionListItem extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidMount() {
        this.listenTo('participant', this.forceUpdate);

        var action = this.props.action;

        if (!this.props.participants) {
            this.getActions('participant').retrieveParticipants(action.id);
        }
    }

    render() {
        var action = this.props.action;
        var actionDate = new Date(action.start_time);
        var participantList;

        var classNames = cx({
            'actionlist-item': true,
            'expanded': this.state.expanded
        });

        if (this.props.participants) {
            participantList = this.props.connectDropTarget(
                <ul className="participants">
                {this.props.participants.map(function(person) {
                    return (
                        <ParticipantItem key={ person.id }
                            action={ action } person={ person }/>
                    );
                }, this)}
                </ul>
            );
        }

        return (
            <li className={ classNames }
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
    onOperation: React.PropTypes.func
};
