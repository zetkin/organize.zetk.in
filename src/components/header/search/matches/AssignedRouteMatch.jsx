import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import MatchBase from './MatchBase';
import Route from '../../../misc/elements/Route';

export default class AssignedRouteMatch extends MatchBase {
    getTitle() {
        let route = this.props.data.route;
        let title = route.title || route.id;

        return (
            <Msg id="header.search.matches.assignedRoute"
                values={{ title }}
                />
        );
    }
}
