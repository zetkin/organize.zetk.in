import React from 'react/addons';
import url from 'url';

import MatchBase from './MatchBase';


export default class LocationMatch extends MatchBase {
    getTitle() {
        const count = this.props.data.action_count;
        const date = this.props.data.date;

        return count + ' actions on ' + date;
    }
}
