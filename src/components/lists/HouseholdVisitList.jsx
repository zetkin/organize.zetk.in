import React from 'react';

import HouseholdVisitListItem from './items/HouseholdVisitListItem';
import List from './List';


export default class HouseholdVisitList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        visitList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    render() {
        let columns = [
            {
                'visit_time': 'lists.householdVisitList.header.visitTime',
            },
            {
                'state': 'lists.householdVisitList.header.state',
            },
            {
                'address': 'lists.householdVisitList.header.address',
            },
        ];

        return (
            <List className="HouseholdVisitList"
                headerColumns={ columns }
                itemComponent={ HouseholdVisitListItem }
                list={ this.props.visitList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
