import React from 'react/addons';

import MatchBase from './MatchBase';


export default class CampaignMatch extends MatchBase {
    getLinkTarget() {
        return '/campaign/campaigns/campaign:' + this.props.data.id;
    }

    getTitle() {
        return this.props.data.title;
    }
}
