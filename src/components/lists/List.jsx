import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import Link from '../misc/Link';
import ListHeader from './ListHeader';
import ListItem from './items/ListItem';
import LoadingIndicator from '../misc/LoadingIndicator';


function r(obj, fieldPath) {
    let path = fieldPath.split('.');
    return path.reduce((o, e) => (!!o)? o[e] : null, obj);
}


let shiftKeyDown = false;

const onKeyDown = ev => {
    if (ev.keyCode == 16) shiftKeyDown = true;
};

const onKeyUp = ev => {
    if (ev.keyCode == 16) shiftKeyDown = false;
};

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
        defaultSortField: React.PropTypes.string,
        allowBulkSelection: React.PropTypes.bool,
        bulkSelection: React.PropTypes.object,
        onItemSelect: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            sortField: this.props.defaultSortField,
            firstVisibleIndex: -1,
            lastVisibleIndex: -1,
        };

        this.lastSelectedId = null;

        this.scrollContainer = null;
        this.onScroll = ev => {
            const listDOMNode = ReactDOM.findDOMNode(this.refs.list);
            const itemNodes = listDOMNode.querySelectorAll('.ListItem');
            if (this.props.list.items && itemNodes.length > 0) {
                const itemHeight = listDOMNode.getBoundingClientRect().height
                    / this.props.list.items.length;

                const ctrRect = this.scrollContainer.getBoundingClientRect();
                const listPos = (listDOMNode.getBoundingClientRect().top - ctrRect.top)
                    + this.scrollContainer.scrollTop;

                const firstIdx = Math.floor((this.scrollContainer.scrollTop-listPos) / itemHeight);
                const lastIdx = firstIdx + Math.ceil(ctrRect.height / itemHeight) + 1;

                this.setState({
                    firstVisibleIndex: firstIdx,
                    lastVisibleIndex: lastIdx,
                });
            }
        };
    }

    componentDidMount() {
        shiftKeyDown = false;
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const node = ReactDOM.findDOMNode(this);
        this.scrollContainer = (node.parentNode || node.parentElement);
        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('scroll', this.onScroll);
            this.onScroll();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);

        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('scroll', this.onScroll);
        }
    }

    componentDidUpdate(prevProps) {
        if(this.onScroll && prevProps.list.items != this.props.list.items){
            this.onScroll();
        }
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
            let sortFunc = ((i0, i1) => {
                let f0 = r(i0.data, sortField);
                let f1 = r(i1.data, sortField);

                if (this.props.sortFunc) {
                    let sorted = this.props.sortFunc(i0, i1, sortField);
                    if (sorted.length == 2) {
                        f0 = sorted[0];
                        f1 = sorted[1];
                    }
                    else {
                        return sorted;
                    }
                }

                if (typeof f0 == 'string' && typeof f1 == 'string') {
                    return f0.localeCompare(f1);
                }
                else if (!f0 && !f1) {
                    return 0;
                }
                else if (!f0) {
                    return 1;
                }
                else if (!f1) {
                    return -1
                }

                if (f0 < f1) return -1;
                if (f0 > f1) return 1;
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

        let selectAllCheckbox;
        if (this.props.allowBulkSelection) {
            let allSelected = false;

            if (selectedIds.length && selectedIds.length == items.length) {
                allSelected = true;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (!item.data || selectedIds.indexOf(item.data.id) < 0) {
                        allSelected = false;
                        break;
                    }
                }
            }

            selectAllCheckbox = (
                <div className="List-selectAllCheckbox">
                    <input type="checkbox"
                        checked={ allSelected }
                        onChange={ this.onSelectAllChange.bind(this) }
                        />
                </div>
            );
        }

        return (
            <div className={ classes }>
                { selectAllCheckbox }
                { header }

                <ul key="List-items" ref="list">
                { items.map((i, index) => {
                    const key = i.data? i.data.id : index;
                    const selected = i.data?
                        !!selectedIds.find(id => id == i.data.id) : false;
                    const inView = (
                        index >= this.state.firstVisibleIndex
                        && index <= this.state.lastVisibleIndex);

                    return (
                        <ListItem key={ key } item={ i }
                            itemComponent={ this.props.itemComponent }
                            showCheckbox={ this.props.allowBulkSelection }
                            selected={ selected } inView={ inView }
                            onItemSelect={ this.onItemSelect.bind(this) }
                            onItemMouseOut={ this.props.onItemMouseOut }
                            onItemMouseOver={ this.props.onItemMouseOver }
                            onItemClick={ this.props.onItemClick }/>
                    );
                }) }
                </ul>
                { loadMoreLink }
            </div>
        );
    }

    onSelectAllChange(ev) {
        this.props.list.items
            .filter(i => !!i.data)
            .forEach(i => {
                this.props.onItemSelect(i, ev.target.checked);
            });
    }

    onItemSelect(item, selected) {
        if (this.props.onItemSelect) {
            let prevItem = this.props.list.items.find(i =>
                i.data && i.data.id === this.lastSelectedId);

            if (selected && shiftKeyDown && prevItem) {
                let prevIdx = this.props.list.items.indexOf(prevItem);
                let curIdx = this.props.list.items.indexOf(item);

                let start = Math.min(prevIdx, curIdx);
                let end = Math.max(prevIdx, curIdx);

                for (let i = start; i <= end; i++) {
                    this.props.onItemSelect(this.props.list.items[i], true);
                }
            }
            else {
                this.props.onItemSelect(item, selected);
            }

            this.lastSelectedId = selected? item.data.id : null;
        }
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
