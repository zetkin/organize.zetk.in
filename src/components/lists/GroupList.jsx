import React from 'react';
import cx from 'classnames';

import List from './List';
import GroupListItem from './items/GroupListItem';


export default class GroupList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        groupList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.groupList !== this.props.groupList
            || nextProps.bulkSelection !== this.props.bulkSelection);
    }

    render() {
        const columns = [
            {
                'title': 'lists.groupList.header.title',
            },
            {
                'size': 'lists.groupList.header.size',
            }
        ];

        return (
            <List className="GroupList"
                headerColumns={ columns } itemComponent={ GroupListItem }
                list={ this.props.groupList }
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
