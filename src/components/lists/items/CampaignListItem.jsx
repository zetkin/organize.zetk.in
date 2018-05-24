import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

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
        const campaign = this.props.data;
        const classes = cx(
            'CampaignListItem',
            {'CampaignListItem-published': campaign.published},
            {'CampaignListItem-draft': !campaign.published},
            {'CampaignListItem-archived': campaign.archived},
        )
        let stateMsg = campaign.published ? 'panes.allCampaigns.campaignState.published' : 'panes.allCampaigns.campaignState.draft';
        if (campaign.archived) {
            stateMsg = 'panes.allCampaigns.campaignState.archived'
        }

        return (
            <div className={classes}
                onClick={ this.props.onItemClick }>
                <span className="CampaignListItem-title">{campaign.title}</span>
                <span className="CampaignListItem-state"><Msg id={stateMsg}/></span>
            </div>
        );
    }
}
