import React from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';


const actionSource = {
    beginDrag(props) {
        return props.action;
    },

    endDrag(props, monitor, component) {
        const dropResult = monitor.getDropResult();
        if (!dropResult) {
            return;
        }

        const action = monitor.getItem();
        const newDate = dropResult.newDate;

        if (dropResult.onMoveAction) {
            dropResult.onMoveAction(action, newDate);
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource('action', actionSource, collect)
export default class ActionItem extends React.Component {
    render() {
        const action = this.props.action;
        const startDate = Date.create(action.start_time);
        const timeLabel = startDate.setUTC(true).format('{HH}:{mm}');
        const className = cx({
            'ActionItem': true,
            'highlight': action.highlight
        });

        return this.props.connectDragSource(
            <li className={ className }
                onClick={ this.onClick.bind(this) }>
                <span className="location">
                    { action.location.title }</span>
                <span className="time">
                    { timeLabel }</span>
                <span className="activity">
                    { action.activity.title }</span>
            </li>
        );
    }

    onClick(ev) {
        if (this.props.onClick) {
            this.props.onClick(this.props.action, ev);
        }
    }
}

ActionItem.propTypes = {
    onClick: React.PropTypes.func,
    action: React.PropTypes.shape({
        id: React.PropTypes.any,            // TODO: Require uuid string
        location: React.PropTypes.object,
        activity: React.PropTypes.object
    }).isRequired
};
