import React from 'react';


import ActionListItem from './items/ActionListItem';
import List from './List';


export default class ActionList extends React.Component {
    static propTypes = {
        actionList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
        onMoveParticipant: React.PropTypes.func,
        onActionOperation: React.PropTypes.func
    }

    render() {
        let actions = this.props.actionList.items.map(i => i.data);

        let columns = [
            {
                'start_time': 'lists.actionList.header.startTime',
            },
            {
                'activity.title': 'lists.actionList.header.activity',
                'location.title': 'lists.actionList.header.location',
            },
            {
                'contact.name': 'lists.actionList.header.contact',
            },
            {
                'num_participants_required': 'lists.actionList.header.participants',
            }
        ];

        return (
            <List className="ActionList"
                list={ this.props.actionList }
                headerColumns={ columns }
                itemComponent={ ActionListItem }
                defaultSortField="start_time"
                bulkSelection={ this.props.bulkSelection }
                allowBulkSelection={ this.props.allowBulkSelection }
                onItemClick={ this.props.onItemClick }
                onItemSelect={ this.props.onItemSelect }
                />
        );
    }
}
