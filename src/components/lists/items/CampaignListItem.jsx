import React from 'react';

import { stringFromAddress } from '../../../utils/location';


export default class CampaignListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object
    }

    onClick() {
        console.log('this.onClick');
        console.log(this.props.data);
        this.props.onItemClick(this.props.data);
    }

    render() {
        let campaign = this.props.data;

        return (
            <div className="CampaignListItem"
                onClick={ this.props.onItemClick }>
                {campaign.title}
            </div>
        );
    }
}
