import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import { DropTarget } from 'react-dnd';


const genericTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props, monitor, component) {
        if (props.onDrop) {
            props.onDrop(monitor.getItem());
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDraggingOver: monitor.isOver(),
    };
}

@DropTarget(props => props.type, genericTarget, collect)
export default class DropContainer extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        instructionsMsg: React.PropTypes.string,
        onDrop: React.PropTypes.func,
    };

    render() {
        let instructions = null;
        if (this.props.instructionsMsg) {
            instructions = (
                <Msg id={ this.props.instructionsMsg }/>
            );
        }

        let classes = cx('DropContainer', {
            'DropContainer-isDraggingOver': this.props.isDraggingOver,
        });

        return this.props.connectDropTarget(
            <div className={ classes }>
                { instructions }
            </div>
        );
    }
}
