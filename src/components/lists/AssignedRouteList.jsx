import React from 'react';

import AssignedRouteListItem from './items/AssignedRouteListItem';
import List from './List';


export default class AssignedRouteList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        assignedRouteList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'route': 'lists.assignedRouteList.header.route',
                'assignment': 'lists.assignedRouteList.header.assignment',
            },
            {
                'canvasser': 'lists.assignedRouteList.header.canvasser',
            },
        ];

        return (
            <List className="AssignedRouteList"
                headerColumns={ columns }
                itemComponent={ AssignedRouteListItem }
                list={ this.props.assignedRouteList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
