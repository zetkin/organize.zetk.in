import React from 'react';
import { DragSource } from 'react-dnd';

import Avatar from './Avatar';


const personSource = {
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
        const newAction = dropResult.newAction;
        const targetType = dropResult.targetType;

        if (dropResult.onAddParticipant) {
            dropResult.onAddParticipant(person);
        }

        // TODO: Use a more generalized interface like this everywhere?
        if (dropResult.onDropPerson) {
            dropResult.onDropPerson(person, targetType);
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


@DragSource('person', personSource, collect)
export default class DraggableAvatar extends React.Component {
    render() {
        return this.props.connectDragSource(
            <div className="DraggableAvatar">
                <Avatar person={ this.props.person }/>
            </div>
        );
    }
}

