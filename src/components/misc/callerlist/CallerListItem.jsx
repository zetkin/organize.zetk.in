import React from 'react';

import DraggableAvatar from '../DraggableAvatar';


export default class CallerListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func,
        caller: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Use string
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
            prioritized_tags: React.PropTypes.array.isRequired,
            excluded_tags: React.PropTypes.array.isRequired,
        }).isRequired
    };

    render() {
        let caller = this.props.caller;
        let name = caller.first_name + ' ' + caller.last_name;

        // TODO: Add buttons to edit or remove from list
        return (
            <li className="CallerListItem"
                onClick={ this.props.onSelect.bind(this, caller) }>

                <DraggableAvatar person={ caller }/>
                <span className="CallerListItem-name">{ name }</span>
                <dl className="CallerListItem-tags">
                    <dt>Prioritized tags</dt>
                    <dd>{ caller.prioritized_tags.length }</dd>
                    <dt>Excluded tags</dt>
                    <dd>{ caller.excluded_tags.length }</dd>
                </dl>

                <a className="CallerListItem-removeButton"
                    onClick={ this.onRemove.bind(this) }>x</a>
            </li>
        );
    }

    onRemove(ev) {
        ev.stopPropagation();
        if (this.props.onRemove) {
            this.props.onRemove(this.props.caller);
        }
    }
}
