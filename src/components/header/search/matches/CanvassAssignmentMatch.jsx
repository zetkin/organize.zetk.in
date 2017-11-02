import React from 'react';

import MatchBase from './MatchBase';


export default class CanvassAssignmentMatch extends MatchBase {
    getTitle() {
        return this.props.data.title;
    }
}
