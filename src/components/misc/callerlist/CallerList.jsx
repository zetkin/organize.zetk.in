import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../Link';
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
        let selectLink = (
            <Link msgId="lists.callerList.selectLink"
                onClick={ this.onClickAddCallers.bind(this) }/>
        );

        let addItem = this.props.connectDropTarget(
            <li className="CallerList-addItem">
                <Msg tagName="p"
                    id="lists.callerList.addCaller"
                    values={{ selectLink }}/>
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
