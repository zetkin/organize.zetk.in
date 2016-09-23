import React from 'react';
import cx from 'classnames';

import ListHeader from './ListHeader';


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

        onSelect: React.PropTypes.func,
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

        if (sortField && this.props.sortFunc) {
            items = items.concat().sort((i0, i1) =>
                this.props.sortFunc(sortField, i0, i1));
        }

        let ItemComponent = this.props.itemComponent;
        let classes = cx(this.props.className, 'List');

        return (
            <div className={ classes }>
                { header }

                <ul key="List-items">
                { items.map((i, index) => {
                    let key = i.data? i.data.id : index;
                    return (
                        <ItemComponent key={ key } callItem={ i }
                            onSelect={ this.onSelect.bind(this, i) }/>
                    );
                }) }
                </ul>
            </div>
        );
    }

    onSelect(item) {
        if (this.props.onSelect) {
            this.props.onSelect(item);
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
