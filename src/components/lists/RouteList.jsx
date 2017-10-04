import React from 'react';
import cx from 'classnames';

import List from './List';
import RouteListItem from './items/RouteListItem';


export default class RouteList extends React.Component {
    static propTypes = {
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        enablePagination: React.PropTypes.bool,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        routeList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.routeList !== this.props.routeList
            || nextProps.bulkSelection !== this.props.bulkSelection);
    }

    render() {
        const columns = [];

        return (
            <List className="RouteList"
                headerColumns={ columns } itemComponent={ RouteListItem }
                list={ this.props.routeList }
                enablePagination={ !!this.props.enablePagination }
                allowBulkSelection={ this.props.allowBulkSelection }
                bulkSelection={ this.props.bulkSelection }
                onItemSelect={ this.props.onItemSelect }
                onItemMouseOut={ this.props.onItemMouseOut }
                onItemMouseOver={ this.props.onItemMouseOver }
                onItemClick={ this.props.onItemClick }
                onLoadPage={ this.props.onLoadPage }
                />
        );
    }
}
