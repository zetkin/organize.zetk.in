import React from 'react';


export default class RouteList extends React.Component {
    render() {
        let items = this.props.list.items.map(item => {
            let route = item.data;

            return (
                <li key={ route.id } className="RouteList-item"
                    onMouseOver={ this.onRouteMouseOver.bind(this, route) }
                    onMouseOut={ this.onRouteMouseOut.bind(this, route) }>
                    <span className="RouteList-itemTitle">{ route.id }</span>
                    <span className="RouteList-itemAddrCount">{ route.addresses.length }</span>
                </li>
            );
        });

        return (
            <ul className="RouteList">
                { items }
            </ul>
        );
    }

    onRouteMouseOver(route) {
        if (this.props.onRouteMouseOver) {
            this.props.onRouteMouseOver(route);
        }
    }

    onRouteMouseOut(route) {
        if (this.props.onRouteMouseOut) {
            this.props.onRouteMouseOut(route);
        }
    }
}
