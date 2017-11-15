import React from 'react';
import cx from 'classnames';

import List from './List';
import AddressListItem from './items/AddressListItem';


export default class AddressList extends React.Component {
    static propTypes = {
        simple: React.PropTypes.bool,
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        addressList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.addressList !== this.props.addressList
            || nextProps.bulkSelection !== this.props.bulkSelection);
    }

    render() {
        let columns = null;

        if (!this.props.simple) {
            columns = [
                {
                    'street': 'lists.addressList.header.street',
                    'number': 'lists.addressList.header.number',
                    'suffix': 'lists.addressList.header.suffix',
                },
            ];
        }
        else {
            columns = [
                {
                    'address': 'lists.addressList.header.address',
                },
            ];
        }

        return (
            <List className="AddressList"
                headerColumns={ columns } itemComponent={ AddressListItem }
                list={ this.props.addressList }
                enablePagination={ !!this.props.enablePagination }
                allowBulkSelection={ this.props.allowBulkSelection }
                bulkSelection={ this.props.bulkSelection }
                onItemSelect={ this.props.onItemSelect }
                onItemClick={ this.props.onItemClick }
                onLoadPage={ this.props.onLoadPage }
                />
        );
    }
}
