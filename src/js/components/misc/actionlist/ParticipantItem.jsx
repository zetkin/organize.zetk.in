import React from 'react/addons';
import { DragSource } from 'react-dnd';
import cx from 'classnames';

import Avatar from '../Avatar';

const participantSource = {
    beginDrag(props) {
        return props.person;
    },

    endDrag(props, monitor, component) {
        const dropResult = monitor.getDropResult();
        if (!dropResult) {
            // This was not a successful drag
            return;
        }

        const person = monitor.getItem();
        const oldAction = props.action;
        const newAction = dropResult.newAction;
        const targetType = dropResult.targetType;

        if (oldAction.id != newAction.id && dropResult.onMoveParticipant) {
            dropResult.onMoveParticipant(person, oldAction);
        }

        if (targetType == 'contact' && dropResult.onSetContact) {
            dropResult.onSetContact(person, oldAction);
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource('person', participantSource, collect)
export default class ParticipantItem extends React.Component {
    render() {
        const visible = this.props.visible;
        const person = this.props.person;
        const name = person.first_name + ' ' + person.last_name;
        const classes = cx({
            'participant': true,
            'hidden': !visible
        });

        return this.props.connectDragSource(
            <li className={ classes }>
                <figure>
                    <Avatar person={ person }/>
                </figure>
            </li>
        );
    }
}

ParticipantItem.propTypes = {
    visible: React.PropTypes.bool,
    person: React.PropTypes.object.isRequired
}
