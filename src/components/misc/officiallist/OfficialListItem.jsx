import React from 'react';

import DraggableAvatar from '../DraggableAvatar';


export default class OfficialListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func,
        official: React.PropTypes.shape({
            role: React.PropTypes.string.isRequired,
            id: React.PropTypes.any.isRequired,     // TODO: Use string
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
        }).isRequired
    };

    render() {
        let official = this.props.official;
        let name = official.first_name + ' ' + official.last_name;

        // TODO: Add buttons to edit or remove from list
        return (
            <li className="OfficialListItem"
                onClick={ this.props.onSelect.bind(this, official) }>

                <DraggableAvatar person={ official }/>
                <span className="OfficialListItem-name">{ name }</span>
                <a className="OfficialListItem-removeButton"
                    onClick={ this.onRemove.bind(this) }></a>
            </li>
        );
    }

    onRemove(ev) {
        ev.stopPropagation();
        if (this.props.onRemove) {
            this.props.onRemove(this.props.official);
        }
    }
}
