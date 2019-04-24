import React, { PropTypes } from 'react';

import List from './List';
import SmsDistributionMessageListItem from './items/SmsDistributionMessageListItem';


export default class SmsDistributionMessageList extends React.Component {
    static propTypes = {
        sortByDefault: PropTypes.bool,
        onItemClick: PropTypes.func,
        messageList: PropTypes.shape({
            error: PropTypes.object,
            isPending: PropTypes.bool,
            items: PropTypes.array,
        }).isRequired,
    }

    render() {
        const columns = [
            {
                'target.first_name': 'lists.smsDistributionMessageList.header.firstName',
                'target.last_name': 'lists.smsDistributionMessageList.header.lastName',
                'phone': 'lists.smsDistributionMessageList.header.phone',
            }
        ];

        return (
            <List className="SmsDistributionMessageList"
                defaultSortField={this.props.sortByDefault ? 'target.first_name' : null}
                headerColumns={columns} itemComponent={SmsDistributionMessageListItem}
                list={this.props.messageList}
                onItemClick={this.props.onItemClick}
            />
        );
    }
}
