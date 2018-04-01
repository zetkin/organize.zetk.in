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
                'time': 'lists.callAssignmentList.header.startTime',
            },
            {
                'title': 'lists.callAssignmentList.header.title',
            },
            {
                'callers': 'lists.callAssignmentList.header.stats',
            }
        ];

        const sortFunc = (i0, i1, sortField) => {
            if (sortField == 'time') {
                let now = new Date();
                let ended0 = (i0.data.end_date && (new Date(i0.data.end_date) < now));
                let ended1 = (i1.data.end_date && (new Date(i1.data.end_date) < now));

                return [
                    (ended1? 'a' : 'z') + i1.data.start_date,
                    (ended0? 'a' : 'z') + i0.data.start_date
                ];
            }
            else {
                return [i0.data[sortField], i1.data[sortField]];
            }
        };

        return (
            <List className="CallAssignmentList"
                headerColumns={ columns }
                sortFunc={ sortFunc } defaultSortField="time"
                itemComponent={ CallAssignmentListItem }
                list={ this.props.callAssignmentList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
