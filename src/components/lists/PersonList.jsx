import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonListItem from './items/PersonListItem';


export default class PersonList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        personList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.personList !== this.props.personList
            || nextProps.bulkSelection !== this.props.bulkSelection);
    }

    render() {
        const columns = [
            {
                'first_name': 'lists.personList.header.firstName',
                'last_name': 'lists.personList.header.lastName',
            },
            {
                'email': 'lists.personList.header.email',
                'phone': 'lists.personList.header.phone',
            }
        ];

        return (
            <List className="PersonList"
                headerColumns={ columns } itemComponent={ PersonListItem }
                list={ this.props.personList }
                allowBulkSelection={ this.props.allowBulkSelection }
                bulkSelection={ this.props.bulkSelection }
                onItemSelect={ this.props.onItemSelect }
                onItemClick={ this.props.onItemClick }
                onLoadPage={ this.props.onLoadPage }
                />
        );
    }
}
