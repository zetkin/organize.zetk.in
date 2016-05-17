import React from 'react';

import CallerListItem from './CallerListItem';


// TODO: Implement drag and drop to add callers?
export default class CallerList extends React.Component {
    static propTypes = {
        callers: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
    };

    render() {
        return (
            <ul className="CallerList">
            { this.props.callers.map(c => (
                <CallerListItem key={ c.id } caller={ c }
                    onSelect={ this.props.onSelect.bind(this) }
                    onRemove={ this.props.onRemove.bind(this) }/>
            )) }
            </ul>
        );
    }
}
