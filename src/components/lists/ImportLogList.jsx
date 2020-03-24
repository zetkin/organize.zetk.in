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

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.importLogList !== this.props.importLogList);
    }

    render() {
        const columns = [
            {
                'status': 'lists.importLogList.header.status',
                'accepted': 'lists.importLogList.header.accpeted',
                'completed': 'lists.importLogList.header.completed',
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
