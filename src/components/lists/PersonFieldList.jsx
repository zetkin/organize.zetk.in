import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonFieldListItem from './items/PersonFieldListItem';


export default class PersonFieldList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        fieldList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        const columns = [
            {
                'title': 'lists.personFieldList.header.title',
            },
        ];

        return (
            <List className="PersonFieldList"
                headerColumns={ columns } itemComponent={ PersonFieldListItem }
                list={ this.props.fieldList }
                defaultSortField="title"
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
