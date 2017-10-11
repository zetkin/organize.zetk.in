import React from 'react';

import CanvassAssignmentListItem from './items/CanvassAssignmentListItem';
import List from './List';


export default class CanvassAssignmentList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        assignmentList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'start_time': 'lists.canvassAssignmentList.header.startTime',
            },
            {
                'title': 'lists.canvassAssignmentList.header.title',
            },
        ];

        return (
            <List className="CanvassAssignmentList"
                headerColumns={ columns }
                itemComponent={ CanvassAssignmentListItem }
                list={ this.props.assignmentList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
