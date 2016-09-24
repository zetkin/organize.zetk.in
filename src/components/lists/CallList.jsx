import React from 'react';

import CallListItem from './items/CallListItem';
import List from './List';


export default class CallList extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        callList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'caller.name': 'Caller',
                'state': 'Status',
            },
            {
                'target.name': 'Target',
                'allocation_time': 'Time',
            }
        ];

        return (
            <List className="CallList"
                headerColumns={ columns } itemComponent={ CallListItem }
                list={ this.props.callList } onSelect={ this.props.onSelect }/>
        );
    }
}
