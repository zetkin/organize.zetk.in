import React from 'react';

import DraggableAvatar from '../DraggableAvatar';


export default class OfficialListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func,
        official: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Use string
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
            prioritized_tags: React.PropTypes.array.isRequired,
            excluded_tags: React.PropTypes.array.isRequired,
        }).isRequired
    };

    render() {
        let official = this.props.official;
        let name = official.person.name;

        // TODO: Add buttons to edit or remove from list
        return (
            <li className="OfficialListItem"
                onClick={ this.props.onSelect.bind(this, official) }>

                <DraggableAvatar person={ official.person }/>
                <span className="OfficialListItem-name">{ name }</span>
                <a className="OfficialListItem-removeButton"
                    onClick={ this.onRemove.bind(this) }><i className="fa fa-remove"></i></a>
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
