import React from 'react/addons';
import { DragSource } from 'react-dnd';

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

        if (dropResult.onMoveParticipant) {
            dropResult.onMoveParticipant(person, oldAction);
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
        var person = this.props.person;
        var name = person.first_name + ' ' + person.last_name;

        return this.props.connectDragSource(
            <li className="participant">
                <figure>
                    <figcaption>{ name }</figcaption>
                </figure>
            </li>
        );
    }
}

ParticipantItem.propTypes = {
    person: React.PropTypes.object.isRequired
}
