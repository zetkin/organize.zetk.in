import React from 'react';
import cx from 'classnames';


export default class ListItem extends React.Component {
    static propTypes = {
        itemComponent: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool,
        showCheckbox: React.PropTypes.bool,
        item: React.PropTypes.shape({
            data: React.PropTypes.object,
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.item != this.props.item
            || nextProps.selected !== this.props.selected);
    }

    render() {
        let ItemComponent = this.props.itemComponent;
        let item = this.props.item;

        let checkbox = null;
        if (this.props.showCheckbox) {
            checkbox = (
                <input type="checkbox"
                    checked={ this.props.selected }
                    className="ListItem-checkbox"
                    onChange={ this.onSelectChange.bind(this) }/>
            );
        }

        let classes = cx('ListItem', {
            'ListItem-withCheckbox': this.props.showCheckbox,
        });

        return (
            <li className={ classes }>
                { checkbox }
                <ItemComponent data={ item.data }
                    onItemClick={ this.onItemClick.bind(this) }/>
            </li>
        );
    }

    onItemClick() {
        if (this.props.onItemClick) {
            let item = this.props.item;
            this.props.onItemClick(item);
        }
    }

    onSelectChange(ev) {
        if (this.props.onItemSelect) {
            let item = this.props.item;
            this.props.onItemSelect(item, !this.props.selected);
        }
    }
}
