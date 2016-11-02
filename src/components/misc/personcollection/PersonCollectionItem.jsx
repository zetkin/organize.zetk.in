import React from 'react';

import DraggableAvatar from '../DraggableAvatar';


export default class PersonCollectionItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        itemComponent: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func,
    };

    render() {
        let item = this.props.item;
        let ItemComponent = this.props.itemComponent;

        return (
            <div className="PersonCollectionItem"
                onClick={ this.props.onSelect.bind(this, item) }>

                <DraggableAvatar person={ item }/>
                <ItemComponent item={ item }/>

                <a className="PersonCollectionItem-removeButton"
                    onClick={ this.onRemove.bind(this) }>
                    <i className="fa fa-remove"></i></a>
                <a className="PersonCollectionItem-editButton">
                    <i className="fa fa-pencil"></i></a>
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
