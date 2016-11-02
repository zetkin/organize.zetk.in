import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../Link';
import PersonCollectionItem from './PersonCollectionItem';
import { createSelection } from '../../../actions/selection';


const personTarget = {
    canDrop(props, monitor) {
        let person = monitor.getItem();
        let persons = props.items;
        let duplicate = persons.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        return {
            targetType: 'person',
            onDropPerson: p => props.onAdd([ p.id ])
        };
    }
};

function collectPerson(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isPersonOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@DropTarget('person', personTarget, collectPerson)
export default class PersonCollection extends React.Component {
    static propTypes = {
        items: React.PropTypes.array.isRequired,
        itemComponent: React.PropTypes.func.isRequired,
        addPersonMsg: React.PropTypes.string.isRequired,
        selectLinkMsg: React.PropTypes.string.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        openPane: React.PropTypes.func.isRequired,
        onSelect: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        onAdd: React.PropTypes.func,
    };

    render() {
        let selectLink = (
            <Link msgId={ this.props.selectLinkMsg }
                onClick={ this.onClickAddPersons.bind(this) }/>
        );

        let addItem = this.props.connectDropTarget(
            <li key="addItem"
                className="PersonCollection-addItem">
                <Msg tagName="p"
                    id={ this.props.addPersonMsg }
                    values={{ selectLink }}/>
            </li>
        );

        let classes = cx('PersonCollection', {
            'PersonCollection-isPersonOver': this.props.isPersonOver,
        });

        return (
            <ul className={ classes }>
                { addItem }
            { this.props.items.map(i => (
                <li key={ i.id } className="PersonCollection-item">
                    <PersonCollectionItem item={ i }
                        itemComponent={ this.props.itemComponent }
                        onSelect={ this.onSelect.bind(this, i) }
                        onRemove={ this.onRemove.bind(this, i) }/>
                </li>
            )) }
            </ul>
        );
    }

    onSelect(item) {
        if (this.props.onSelect) {
            this.props.onSelect(item);
        }
    }

    onRemove(item) {
        if (this.props.onRemove) {
            this.props.onRemove(item);
        }
    }

    onClickAddPersons(ev) {
        // TODO: Externalize instructions
        // TODO: Add existing people as pre-selection
        let action = createSelection('person', null, null, ids =>
            this.props.onAdd(ids));

        this.props.dispatch(action);
        this.props.openPane('selectpeople', action.payload.id);
    }
}
