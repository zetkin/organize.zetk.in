import React from 'react';
import cx from 'classnames';

import Link from '../misc/Link';
import ListHeader from './ListHeader';
import ListItem from './items/ListItem';
import LoadingIndicator from '../misc/LoadingIndicator';


function r(obj, fieldPath) {
    let path = fieldPath.split('.');
    return path.reduce((o, e) => o[e], obj);
}

export default class List extends React.Component {
    static propTypes = {
        list: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.arrayOf(React.PropTypes.shape({
                isPending: React.PropTypes.bool,
                data: React.PropTypes.object,
            })).isRequired,
        }).isRequired,
        enablePagination: React.PropTypes.bool,
        headerColumns: React.PropTypes.array,
        itemComponent: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
        sortFunc: React.PropTypes.func,
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let list = this.props.list;
        let items = list.items;
        let sortField = this.state.sortField;

        let header = null;
        if (this.props.headerColumns) {
            header = (
                <ListHeader columns={ this.props.headerColumns }
                    sortField={ sortField }
                    onFieldClick={ this.onFieldClick.bind(this) }/>
            );
        }

        if (sortField) {
            // Use custom sort func from properties if one exists, or use a
            // default sort func which resolves fields from the header columns
            // and uses standard JS comparison to figure out order.
            let sortFunc = this.props.sortFunc || ((i0, i1) => {
                if (r(i0.data, sortField) < r(i1.data, sortField)) return -1;
                if (r(i0.data, sortField) > r(i1.data, sortField)) return 1;
                return 0;
            });

            items = items.concat().sort(sortFunc);
        }

        let selectedIds = [];
        if (this.props.bulkSelection) {
            selectedIds = this.props.bulkSelection.selectedIds;
        }

        let classes = cx(this.props.className, 'List');

        let loadMoreLink = null;
        if (this.props.enablePagination) {
            if (list.isPending) {
                loadMoreLink = <LoadingIndicator />;
            }
            else {
                loadMoreLink = (
                    <Link className="List-loadMoreLink"
                        msgId="lists.loadMoreLink"
                        onClick={ this.onLoadMoreClick.bind(this) }/>
                );
            }
        }

        return (
            <div className={ classes }>
                { header }

                <ul key="List-items">
                { items.map((i, index) => {
                    let key = i.data? i.data.id : index;
                    let selected = i.data?
                        !!selectedIds.find(id => id == i.data.id) : false;

                    return (
                        <ListItem key={ key } item={ i }
                            itemComponent={ this.props.itemComponent }
                            showCheckbox={ this.props.allowBulkSelection }
                            selected={ selected }
                            onItemSelect={ this.props.onItemSelect }
                            onItemClick={ this.props.onItemClick }/>
                    );
                }) }
                </ul>
                { loadMoreLink }
            </div>
        );
    }

    onLoadMoreClick() {
        if (this.props.onLoadPage) {
            this.props.onLoadPage(this.props.list.lastPage + 1);
        }
    }

    onFieldClick(field) {
        if (field == this.state.sortField) {
            // Click the same twice? Reset
            field = undefined;
        }

        this.setState({
            sortField: field
        });
    }
}
