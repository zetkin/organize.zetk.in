import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class RouteList extends React.Component {
    render() {
        let items = this.props.list.items.map(item => {
            let route = item.data;
            let addressesCount = route.addresses.length;
            let householdsCount = route.household_count;

            return (
                <li key={ route.id } className="RouteList-item"
                    onMouseOver={ this.onRouteMouseOver.bind(this, route) }
                    onMouseOut={ this.onRouteMouseOut.bind(this, route) }>
                    <h3 className="RouteList-itemTitle">{ route.id }</h3>
                    <span className="RouteList-itemAddrCount">
                        <Msg id="panes.allRoutes.routePanel.routeList.addresses"
                            values={{ addressesCount }}/>
                    </span>
                    <span className="RouteList-itemHouseholdCount">
                        <Msg id="panes.allRoutes.routePanel.routeList.households"
                            values={{ householdsCount }}/>
                    </span>
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
