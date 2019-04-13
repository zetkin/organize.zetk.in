import React from 'react';

import SmsDistributionListItem from './items/SmsDistributionListItem';
import List from './List';


const sortFunc = (i0, i1, sortField) => {
    let desc = false;

    let v0 = i0.data[sortField];
    let v1 = i1.data[sortField];

    if (sortField === 'id') {
        desc = true;
    } else if (sortField === 'sent') {
        desc = true;

        if (!v0) {
            v0 = '';
        }
        if (!v1) {
            v1 = '';
        }
    } else if (sortField == 'state') {
        const states = ['draft', 'confirm', 'sending', 'sent'];

        // <List/> puts falsy values last
        v0 = states.indexOf(v0) + 1;
        v1 = states.indexOf(v1) + 1;
    }

    if (v0 === v1) {
        return sortFunc(i0, i1, 'id');
    }

    if (desc) {
        [v0, v1] = [v1, v0];
    }

    return [v0, v1];
};

export default class SmsDistributionList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        smsDistributionList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'title': 'lists.smsDistributionList.header.title',
            },
            {
                'sent': 'lists.smsDistributionList.header.sent',
            },
            {
                'state': 'lists.smsDistributionList.header.state',
            }
        ];

        const sortedDistributionList = {
            ...this.smsDistributionList,
            items: this.props.smsDistributionList.items
                .concat()
                .sort((i0, i1) => sortFunc(i0, i1, 'id')),
        };

        return (
            <List className="SmsDistributionList"
                headerColumns={columns}
                itemComponent={SmsDistributionListItem}
                list={sortedDistributionList}
                sortFunc={sortFunc}
                onItemClick={this.props.onItemClick} />
        );
    }
}
