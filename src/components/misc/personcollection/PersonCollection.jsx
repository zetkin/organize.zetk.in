import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../Link';
import PersonCollectionItem from './PersonCollectionItem';
import PersonSelectWidget from '../PersonSelectWidget';
import { createSelection } from '../../../actions/selection';


export default class PersonCollection extends React.Component {
    static propTypes = {
        items: React.PropTypes.array.isRequired,
        itemComponent: React.PropTypes.func.isRequired,
        showEditButtons: React.PropTypes.bool,
        showRemoveButtons: React.PropTypes.bool,
        enableAdd: React.PropTypes.bool,
        selectLinkMsg: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        openPane: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        onAdd: React.PropTypes.func,
    };

    static defaultProps = {
        showEditButtons: true,
        showRemoveButtons: true,
    };

    render() {
        let addItem;

        if (this.props.enableAdd) {
            // Change key when person count changes, to force the
            // component to be reset when a new person is added
            const key = 'addPerson' + (this.props.items.length + 1);
            addItem = (
                    <PersonSelectWidget person={ null } key={ key }
                        onSelect={ this.onParticipantAdd.bind(this) }/>
            );
        }

        return (
            <ul className="PersonCollection">
                { addItem }
            { this.props.items.map(i => (
                <li key={ i.id } className="PersonCollection-item">
                    <PersonCollectionItem item={ i }
                        itemComponent={ this.props.itemComponent }
                        showEditButton={ this.props.showEditButtons }
                        showRemoveButton={ this.props.showRemoveButtons }
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

    onParticipantAdd(person) {
        if (this.props.onAdd) {
            this.props.onAdd(person);
        }
    }
}
