import React from 'react/addons';
import { DropTarget } from 'react-dnd';

import ActionItem from './ActionItem';


const dayTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props) {
        return {
            onMoveAction: props.onMoveAction,
            newDate: props.date
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

@DropTarget('action', dayTarget, collect)
export default class ActionDay extends React.Component {
    render() {
        const DAY_LABELS = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

        const date = this.props.date;
        const dateLabel = date.getDate() + '/' + (date.getMonth() + 1);
        const dayLabel = DAY_LABELS[date.getDay()];

        return this.props.connectDropTarget(
            <div className="actionday">
                <h3>
                    <span className="date">{ dateLabel }</span>
                    <span className="weekday">{ dayLabel }</span>
                </h3>
                <ul>
                { this.props.actions.map(function(action) {
                    return <ActionItem key={ action.id } action={ action }
                            onClick={ this.onActionClick.bind(this, action) }/>
                }, this) }
                    <li className="actionday-pseudoitem">
                        <button className="actionday-addbutton"
                            onClick={ this.onAddClick.bind(this) }/>
                    </li>
                </ul>
            </div>
        );
    }

    onActionClick(action) {
        if (this.props.onSelectAction) {
            this.props.onSelectAction(action);
        }
    }

    onAddClick() {
        if (this.props.onAddAction) {
            this.props.onAddAction(this.props.date);
        }
    }
}

ActionDay.propTypes = {
    onSelectAction: React.PropTypes.func,
    onAddAction: React.PropTypes.func
};
