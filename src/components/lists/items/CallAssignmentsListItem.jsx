import React from 'react';

import Avatar from '../../misc/Avatar';


export default class CallAssignmentsListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let assignment = this.props.data;

        return (
            <div className="CallAssignmentsListItem"
                onClick={ () => {this.props.onSelect(assignment)} }>
                <h1>{ assignment.title }</h1>
                <p>{ assignment.description }</p>
            </div>
        );
    }
}
