import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class RoutePanelList extends React.Component {
    render() {
        let items = this.props.list.items.map(item => {
            let route = item.data;
            let addressesCount = route.addresses.length;
            let householdsCount = route.household_count;
            let labelMsg = this.props.labelMsg
                || 'panes.allRoutes.routePanel.routeList.label';

            return (
                <li key={ route.id } className="RoutePanelList-item"
                    onClick={ this.onRouteClick.bind(this, route) }
                    onMouseOver={ this.onRouteMouseOver.bind(this, route) }
                    onMouseOut={ this.onRouteMouseOut.bind(this, route) }>
                    <h3 className="RoutePanelList-itemTitle">
                        <Msg id={ labelMsg } values={{ id: route.id }}/>
                    </h3>
                    <span className="RoutePanelList-itemAddrCount">
                        <Msg id="panes.allRoutes.routePanel.routeList.addresses"
                            values={{ addressesCount }}/>
                    </span>
                    <span className="RoutePanelList-itemHouseholdCount">
                        <Msg id="panes.allRoutes.routePanel.routeList.households"
                            values={{ householdsCount }}/>
                    </span>
                </li>
            );
        });

        return (
            <ul className="RoutePanelList">
                { items }
            </ul>
        );
    }

    onRouteClick(route) {
        if (this.props.onRouteClick) {
            this.props.onRouteClick(route);
        }
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
