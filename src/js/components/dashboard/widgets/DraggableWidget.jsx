import React from 'react/addons';
import { DragSource, DropTarget } from 'react-dnd';
import cx from 'classnames';


const widgetSource = {
    beginDrag(props) {
        return props.data;
    },

    endDrag(props, monitor, component) {
        const dropResult = monitor.getDropResult();
        if (!dropResult) {
            return;
        }

        const widgetData = monitor.getItem();

        if (props.onMoveWidget) {
            props.onMoveWidget(props.data, dropResult.widget);
        }
    }
};

const widgetTarget = {
    canDrop(props, monitor) {
        return props.data != monitor.getItem();
    },

    drop(props) {
        return {
            widget: props.data
        };
    }
};

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

@DragSource('widget', widgetSource, collectSource)
@DropTarget('widget', widgetTarget, collectTarget)
export default class DraggableWidget extends React.Component {
    render() {
        const content = this.props.connectDragSource(
            <div className={ classes }>
                { this.props.children }
            </div>
        );

        const classes = cx({
            'dashboard-widgetcontainer': true,
            'dragover': this.props.isOver && this.props.canDrop
        });

        return this.props.connectDropTarget(
            <div className={ classes }>
                { content }
            </div>
        );
    }
}

DraggableWidget.propTypes = {
    data: React.PropTypes.object
};
