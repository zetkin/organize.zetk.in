import React from 'react';

import Avatar from '../Avatar';


export default class CallerListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
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

                <Avatar person={ caller }/>
                <span className="CallerListItem-name">{ name }</span>
            </li>
        );
    }
}
