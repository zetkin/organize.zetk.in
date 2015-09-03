import React from 'react/addons';
import url from 'url';

import MatchBase from './MatchBase';


export default class QueryMatch extends MatchBase {
    getTitle() {
        return 'Person query: ' + this.props.data.title;
    }
}
