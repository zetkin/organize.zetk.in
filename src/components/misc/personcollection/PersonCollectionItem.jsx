import React from 'react';

import DraggableAvatar from '../DraggableAvatar';
import Avatar from '../Avatar';


export default class PersonCollectionItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        itemComponent: React.PropTypes.func.isRequired,
        showEditButton: React.PropTypes.bool,
        showRemoveButton: React.PropTypes.bool,
        onRemove: React.PropTypes.func,
        draggableAvatar: React.PropTypes.bool,
    };

    render() {
        let item = this.props.item;
        let ItemComponent = this.props.itemComponent;
        let editButton, removeButton;
        const draggable = 'draggableAvatar' in this.props ? this.props.draggableAvatar : true;

        if (this.props.showEditButton) {
            editButton = (
                <a className="PersonCollectionItem-editButton">
                    <i className="fa fa-pencil"></i></a>
            );
        }

        if (this.props.showRemoveButton) {
            removeButton = (
                <a className="PersonCollectionItem-removeButton"
                    onClick={ this.onRemove.bind(this) }>
                    <i className="fa fa-remove"></i></a>
            );
        }

        return (
            <div className="PersonCollectionItem"
                onClick={ this.props.onSelect.bind(this, item) }>

                { draggable ?
                    <DraggableAvatar person={ item }/>
                    : <Avatar person={ item } />
                }
                <ItemComponent item={ item }/>

                { removeButton }
                { editButton }
            </div>
        );
    }

    onRemove(ev) {
        ev.stopPropagation();
        if (this.props.onRemove) {
            this.props.onRemove(this.props.item);
        }
    }
}
