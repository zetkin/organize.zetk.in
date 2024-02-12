import React from 'react';
import url from 'url';

import MatchBase from './MatchBase';


export default class LocationMatch extends MatchBase {
    getTitle() {
        return this.props.data.title;
    }

    getImage() {
        return null;
    }
}
