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
    }

    render() {
        const columns = [
            {
                'status': 'lists.importLogList.header.status',
                'accepted': 'lists.importLogList.header.accepted',
                'completed': 'lists.importLogList.header.completed',
            },
            {
                'imported_by': 'lists.importLogList.header.imported_by',
            }
        ];

        return (
            <List className="ImportLogList"
                headerColumns={ columns }
                itemComponent={ ImportLogListItem }
                list={ this.props.importLogList }
                allowBulkSelection={ false }
                />
        );
    }
}
