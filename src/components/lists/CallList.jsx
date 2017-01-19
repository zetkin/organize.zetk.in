import React from 'react';

import CallListItem from './items/CallListItem';
import List from './List';


export default class CallList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        callList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'allocation_time': 'lists.callList.header.time',
            },
            {
                'target.name': 'lists.callList.header.targetName',
                'state': 'lists.callList.header.status',
                'caller.name': 'lists.callList.header.callerName',
            },
            {
                'organizer_action_needed': 'lists.callList.header.action',
            }
        ];

        return (
            <List className="CallList"
                headerColumns={ columns } itemComponent={ CallListItem }
                list={ this.props.callList } onItemClick={ this.props.onItemClick }/>
        );
    }
}
