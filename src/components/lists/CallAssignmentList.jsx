import React from 'react';

import CallAssignmentListItem from './items/CallAssignmentListItem';
import List from './List';


export default class CallAssignmentList extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        callAssignmentList: React.PropTypes.shape({
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
            <List className="CallAssignmentList"
                headerColumns={ columns } itemComponent={ CallAssignmentListItem }
                list={ this.props.callAssignmentList } onSelect={ this.props.onSelect }/>
        );
    }
}
