import React from 'react';

import SmsDistributionListItem from './items/SmsDistributionListItem';
import List from './List';


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
        return (
            <List className="SmsDistributionList"
                itemComponent={ SmsDistributionListItem }
                list={ this.props.smsDistributionList }
                defaultSortField="id"
                sortFunc={(i0, i1) => [i1.data.id, i0.data.id]}
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
