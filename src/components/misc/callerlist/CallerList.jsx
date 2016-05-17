import React from 'react';

import CallerListItem from './CallerListItem';


// TODO: Implement drag and drop to add callers?
export default class CallerList extends React.Component {
    static propTypes = {
        callers: React.PropTypes.array.isRequired,
    };

    render() {
        return (
            <ul className="CallerList">
            { this.props.callers.map(c => (
                <CallerListItem key={ c.id } caller={ c }/>
            )) }
            </ul>
        );
    }
}
