import React from 'react';
import cx from 'classnames';

import ListHeader from './ListHeader';
import ListItem from './items/ListItem';


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
        headerColumns: React.PropTypes.array,
        itemComponent: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
        sortFunc: React.PropTypes.func,

        onItemClick: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let items = this.props.list.items;
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

        let classes = cx(this.props.className, 'List');

        return (
            <div className={ classes }>
                { header }

                <ul key="List-items">
                { items.map((i, index) => {
                    let key = i.data? i.data.id : index;
                    return (
                        <ListItem key={ key } item={ i }
                            itemComponent={ this.props.itemComponent }
                            onItemClick={ this.props.onItemClick }/>
                    );
                }) }
                </ul>
            </div>
        );
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
