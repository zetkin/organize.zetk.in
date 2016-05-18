import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';

import CallerListItem from './CallerListItem';


const callerTarget = {
    canDrop(props, monitor) {
        let person = monitor.getItem();
        let callers = props.callers;
        let duplicate = callers.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        console.log('DROP!');
        return {
            targetType: 'caller',
            onDropPerson: p => props.onAdd(p)
        };
    }
};

function collectCaller(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isCallerOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@DropTarget('person', callerTarget, collectCaller)
export default class CallerList extends React.Component {
    static propTypes = {
        callers: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func,
    };

    render() {
        let addItem = this.props.connectDropTarget(
            <li className="CallerList-addItem">
                <p>
                    Drag a person here or <a
                        onClick={ this.onClickAddCallers.bind(this) }>
                        select callers to be added</a>.
                </p>
            </li>
        );

        let classes = cx('CallerList', {
            'CallerList-isPersonOver': this.props.isCallerOver,
        });

        return (
            <ul className={ classes }>
                { addItem }
            { this.props.callers.map(c => (
                <CallerListItem key={ c.id } caller={ c }
                    onSelect={ this.props.onSelect.bind(this) }
                    onRemove={ this.props.onRemove.bind(this) }/>
            )) }
            </ul>
        );
    }

    onClickAddCallers(ev) {
        if (this.props.onAdd) {
            this.props.onAdd(null);
        }
    }
}
