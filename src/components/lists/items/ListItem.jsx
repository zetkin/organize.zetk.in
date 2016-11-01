import React from 'react';


export default class ListItem extends React.Component {
    static propTypes = {
        itemComponent: React.PropTypes.func.isRequired,
        item: React.PropTypes.shape({
            data: React.PropTypes.object,
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.item != this.props.item);
    }

    render() {
        let ItemComponent = this.props.itemComponent;
        let item = this.props.item;

        return (
            <li className="ListItem">
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
}
