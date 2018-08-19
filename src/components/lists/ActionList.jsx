import React from 'react';
import { connect } from 'react-redux';
import memoize from 'fast-memoize';

import ActionListItem from './items/ActionListItem';
import List from './List';


const mapStateToProps = state => ({
    participants: state.participants,
    responses: state.actionResponses,
});

const memoizedItemProps = memoize((dispatch, participants, responses) => ({
    dispatch,
    participants: participants,
    responses: responses,
}));

@connect(mapStateToProps)
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

    shouldComponentUpdate(nextProps) {
        if (nextProps.actionList != this.props.actionList) {
            return true;
        }

        if (nextProps.participants != this.props.participants) {
            return true;
        }

        if (nextProps.responses != this.props.responses) {
            return true;
        }

        return false;
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

        const getItemProps = action => memoizedItemProps(
            this.props.dispatch,
            action? this.props.participants.byAction[action.id] : null,
            action? this.props.responses.byAction[action.id] : null);

        return (
            <List className="ActionList"
                list={ this.props.actionList }
                headerColumns={ columns }
                itemComponent={ ActionListItem }
                itemProps={ getItemProps }
                defaultSortField="start_time"
                bulkSelection={ this.props.bulkSelection }
                allowBulkSelection={ this.props.allowBulkSelection }
                onItemClick={ this.props.onItemClick }
                onItemSelect={ this.props.onItemSelect }
                />
        );
    }
}
