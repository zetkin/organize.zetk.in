import React from 'react';

import CallAssignmentListItem from './items/CallAssignmentListItem';
import List from './List';


export default class CallAssignmentList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        callAssignmentList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'start_time': 'lists.callAssignmentList.header.startTime',
            },
            {
                'title': 'lists.callAssignmentList.header.title',
            },
            {
                'callers': 'lists.callAssignmentList.header.stats',
            }
        ];

        return (
            <List className="CallAssignmentList"
                headerColumns={ columns }
                itemComponent={ CallAssignmentListItem }
                list={ this.props.callAssignmentList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
