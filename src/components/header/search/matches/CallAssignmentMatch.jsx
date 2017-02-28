import React from 'react';

import MatchBase from './MatchBase';


export default class CallAssignmentMatch extends MatchBase {
    getTitle() {
        return this.props.data.title;
    }

    getImage() {
        // TODO: Use some sort of phone icon?
        return null;
    }
}
