import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import LoadingIndicator from '../../misc/LoadingIndicator';


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
            || nextProps.inView != this.props.inView
            || nextProps.selected !== this.props.selected);
    }

    render() {
        let ItemComponent = this.props.itemComponent;
        let item = this.props.item;

        let checkbox = null;
        if (this.props.showCheckbox) {
            checkbox = (
                <div key="checkbox" className="ListItem-selection">
                    <input type="checkbox"
                        checked={ this.props.selected }
                        className="ListItem-checkbox"
                        onChange={ this.onSelectChange.bind(this) }/>
                </div>
            );
        }

        let classes = cx('ListItem', {
            'ListItem-withCheckbox': this.props.showCheckbox,
        });

        let content = null;
        if (item.isPending) {
            content = <LoadingIndicator />;
        }
        else {
            content = [
                checkbox,
                <ItemComponent key="item" data={ item.data }
                    inView={ this.props.inView }
                    onItemMouseOut={ this.onItemMouseOut.bind(this) }
                    onItemMouseOver={ this.onItemMouseOver.bind(this) }
                    onItemClick={ this.onItemClick.bind(this) }/>,
            ];
        }

        return (
            <li className={ classes }>
                { content }
            </li>
        );
    }

    onItemMouseOver(ev) {
        if (this.props.onItemMouseOver) {
            let item = this.props.item;
            this.props.onItemMouseOver(item, ev);
        }
    }

    onItemMouseOut(ev) {
        if (this.props.onItemMouseOut) {
            let item = this.props.item;
            this.props.onItemMouseOut(item, ev);
        }
    }

    onItemClick(ev) {
        if (this.props.onItemClick) {
            let item = this.props.item;
            this.props.onItemClick(item, ev);
        }
    }

    onSelectChange(ev) {
        if (this.props.onItemSelect) {
            let item = this.props.item;
            this.props.onItemSelect(item, !this.props.selected);
        }
    }
}
