import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonTagListItem from './items/PersonTagListItem';


export default class PersonTagList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        tagList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        const columns = [
            {
                'title': 'lists.personTagList.header.title',
            },
        ];

        return (
            <List className="PersonTagList"
                headerColumns={ columns } itemComponent={ PersonTagListItem }
                list={ this.props.tagList }
                defaultSortField="title"
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
