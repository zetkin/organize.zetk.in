import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonQueryListItem from './items/PersonQueryListItem';


export default class PersonQueryList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        queryList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        const columns = [
            {
                'title': 'lists.queryList.header.title',
            },
        ];

        return (
            <List className="PersonQueryList"
                headerColumns={ columns } itemComponent={ PersonQueryListItem }
                list={ this.props.queryList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
