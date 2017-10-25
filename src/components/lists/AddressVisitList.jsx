import React from 'react';

import AddressVisitListItem from './items/AddressVisitListItem';
import List from './List';


export default class AddressVisitList extends React.Component {
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
                'address': 'lists.addressVisitList.header.address',
            },
            {
                'status': 'lists.addressVisitList.header.status',
            },
        ];

        return (
            <List className="AddressVisitList"
                headerColumns={ columns }
                itemComponent={ AddressVisitListItem }
                list={ this.props.visitList }
                onItemClick={ this.props.onItemClick }/>
        );
    }
}
