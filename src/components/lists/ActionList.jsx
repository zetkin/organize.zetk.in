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
                'start_time': 'Time',
            },
            {
                'activity': 'Activity',
                'location': 'Location',
            },
            {
                'contact': 'Contact',
            },
            {
                'participants': 'Participants',
            }
        ];

        return (
            <List className="ActionList"
                list={ this.props.actionList }
                headerColumns={ columns }
                itemComponent={ ActionListItem }
                onSelect={ this.props.onSelect }
                />
        );
    }
}
