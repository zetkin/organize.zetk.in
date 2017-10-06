import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import RoutePanelListItem from './RoutePanelListItem';


export default class RoutePanelList extends React.Component {
    render() {
        let items = this.props.list.items.map(item => (
            <RoutePanelListItem key={ item.data.id }
                onClick={ this.onRouteClick.bind(this, item.data) }
                onMouseOver={ this.onRouteMouseOver.bind(this, item.data) }
                onMouseOut={ this.onRouteMouseOut.bind(this, item.data) }
                labelMsg={ this.props.labelMsg }
                route={ item.data }
                />
        ));

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
