import React from 'react/addons';

import MatchBase from './MatchBase';


export default class PersonMatch extends MatchBase {
    getLinkTarget() {
        return '/people/list/person:' + this.props.data.id;
    }

    getTitle() {
        return this.props.data.first_name + ' ' + this.props.data.last_name;
    }
}
