import React from 'react/addons';

import MatchBase from './MatchBase';


export default class CampaignMatch extends MatchBase {
    getTitle() {
        return this.props.data.title;
    }
}
