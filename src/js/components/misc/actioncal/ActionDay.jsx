import React from 'react/addons';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

import ActionItem from './ActionItem';
import ActionDayOverflow from './ActionDayOverflow';


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

        const maxVisible = this.props.maxVisible;
        const actions = this.props.actions;
        const cappedActions = actions.slice(0, maxVisible);

        var overflow = null;
        if (actions.length > maxVisible) {
            const overflowActions = actions.slice(maxVisible);

            overflow = <ActionDayOverflow actions={ overflowActions }
                onClick={ this.onDayClick.bind(this) }/>;
        }

        const classes = cx({
            'actionday': true,
            'dragover': this.props.isOver
        });

        return this.props.connectDropTarget(
            <div className={ classes }>
                <h3 onClick={ this.onDayClick.bind(this) }>
                    <span className="date">{ dateLabel }</span>
                    <span className="weekday">{ dayLabel }</span>
                </h3>
                <ul>
                { cappedActions.map(function(action) {
                    return <ActionItem key={ action.id } action={ action }
                            onClick={ this.onActionClick.bind(this, action) }/>
                }, this) }
                    { overflow }
                    <li className="actionday-pseudoitem">
                        <button className="actionday-addbutton"
                            onClick={ this.onAddClick.bind(this) }/>
                    </li>
                </ul>
            </div>
        );
    }

    onDayClick() {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.date);
        }
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
    maxVisible: React.PropTypes.number,
    onSelectAction: React.PropTypes.func,
    onAddAction: React.PropTypes.func
};

ActionDay.defaultProps = {
    maxVisible: 5
};
