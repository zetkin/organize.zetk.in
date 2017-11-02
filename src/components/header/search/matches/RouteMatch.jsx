import React from 'react';

import MatchBase from './MatchBase';
import Route from '../../../misc/elements/Route';


export default class RouteMatch extends MatchBase {
    getTitle() {
        return <Route route={ this.props.data }/>;
    }
}
