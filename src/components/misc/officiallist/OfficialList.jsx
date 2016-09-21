import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';

import OfficialListItem from './OfficialListItem';


const officialTarget = {
    canDrop(props, monitor) {
        let person = monitor.getItem();
        let officials = props.officials;
        let duplicate = officials.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        return {
            targetType: 'official',
            onDropPerson: p => props.onAdd(p)
        };
    }
};

function collectOfficial(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOfficialOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@DropTarget('person', officialTarget, collectOfficial)
export default class OfficialList extends React.Component {
    static propTypes = {
        officials: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func,
    };

    render() {
        let addItem = this.props.connectDropTarget(
            <li key="add" className="OfficialList-addItem">
                <p>
                    Drop or <a
                        onClick={ this.onClickAddOfficials.bind(this) }>
                        select officials</a>.
                </p>
            </li>
        );

        let classes = cx('OfficialList', {
            'OfficialList-isPersonOver': this.props.isOfficialOver,
        });

        return (
            <ul className={ classes }>
            { this.props.officials.map(o => (
                <OfficialListItem key={ o.id } official={ o }
                    onSelect={ this.props.onSelect.bind(this) }
                    onRemove={ this.props.onRemove.bind(this) }/>
            )) }
                { addItem }
            </ul>
        );
    }

    onClickAddOfficials(ev) {
        if (this.props.onAdd) {
            this.props.onAdd(null);
        }
    }
}
