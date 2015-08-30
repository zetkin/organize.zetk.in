import React from 'react/addons';

import MatchBase from './MatchBase';
import Avatar from '../../misc/Avatar';


export default class PersonMatch extends MatchBase {
    getTitle() {
        return this.props.data.first_name + ' ' + this.props.data.last_name;
    }

    getImage() {
        return <Avatar person={ this.props.data }/>;
    }
}
