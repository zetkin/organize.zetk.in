import React from 'react';

import CallAssignmentsListItem from './items/CallAssignmentsListItem';
import List from './List';


export default class CallAssignmentsList extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        callAssignmentsList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'title': 'lists.callAssignmentList.header.title',
            },
            {
                'callers': 'lists.callAssignmentList.header.callers',
            }
        ];

        return (
            <List className="CallAssignmentsList"
                headerColumns={ columns } itemComponent={ CallAssignmentsListItem }
                list={ this.props.callAssignmentsList } onSelect={ this.props.onSelect }/>
        );
    }
}
