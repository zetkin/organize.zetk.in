import React from 'react';
import cx from 'classnames';

import List from './List';
import ImportLogListItem from './items/ImportLogListItem';


export default class ImportLogList extends React.Component {
    static propTypes = {
        importLogList: React.PropTypes.shape({
            error: React.PropTypes.string,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
        onItemClick: React.PropTypes.func.isRequired
    }

    render() {
        const columns = [
            {
                'date': 'lists.importLogList.header.date',
                'time': 'lists.importLogList.header.time',
            },
            {
                'status': 'lists.importLogList.header.status',
                'imported': 'lists.importLogList.header.imported'
            },
        ];

        return (
            <List className="ImportLogList"
                headerColumns={ columns }
                itemComponent={ ImportLogListItem }
                list={ this.props.importLogList }
                allowBulkSelection={ false }
                onItemClick={ this.props.onItemClick } />
        );
    }
}
