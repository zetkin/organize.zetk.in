import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import RoutePanelListItem from './RoutePanelListItem';


export default class RoutePanelList extends React.Component {
    render() {
        let sorted = this.props.list.items.concat().sort((i0, i1) => {
            if (i0.data.title && !i1.data.title) {
                return -1;
            }
            else if (i1.data.title && !i0.data.title) {
                return 1;
            }
            else {
                let t0 = i0.data.title || i0.data.id;
                let t1 = i1.data.title || i1.data.id;
                return t0.localeCompare(t1);
            }
        });

        let items = sorted.map(item => (
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
