import React from 'react/addons';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

import ActionItem from './ActionItem';
import ActionDayOverflow from './ActionDayOverflow';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

const dayTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props, monitor, component, meta) {
        const callback = meta.shiftKey?
            props.onCopyAction : props.onMoveAction;

        return {
            onMoveAction: callback,
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

        var actions = this.props.actions;
        var overflow = null;

        if (actions.length > maxVisible) {
            const overflowActions = actions.slice(maxVisible - 1);

            overflow = <ActionDayOverflow actions={ overflowActions }
                onClick={ this.onDayClick.bind(this) }/>;

            actions = actions.slice(0, maxVisible - 1);
        }

        const classes = cx({
            'actionday': true,
            'today': date.is('today'),
            'dragover': this.props.isOver
        });

        var dropHint = null;
        if (this.props.isOver) {
            dropHint = <span className="clonehint">
                Hold <code>shift</code> to copy action.</span>;
        }

        return this.props.connectDropTarget(
            <div className={ classes }>
                <h3 onClick={ this.onDayClick.bind(this) }>
                    <span className="date">{ dateLabel }</span>
                    <span className="weekday">{ dayLabel }</span>
                </h3>
                <CSSTransitionGroup transitionName="actionitem" component="ul">
                { actions.map(function(action) {
                    return <ActionItem key={ action.id } action={ action }
                            onClick={ this.onActionClick.bind(this, action) }/>
                }, this) }
                    { overflow }
                    <li className="actionday-pseudoitem">
                        <button className="actionday-addbutton"
                            onClick={ this.onAddClick.bind(this) }/>
                    </li>
                </CSSTransitionGroup>
                { dropHint }
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
