import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import { stringFromAddress } from '../../../utils/location';


export default class CampaignListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object
    }

    render() {
        const campaign = this.props.data;
        const classes = cx(
            'CampaignListItem',
            {'CampaignListItem-published': campaign.published},
            {'CampaignListItem-draft': !campaign.published},
            {'CampaignListItem-archived': campaign.archived},
        )

        let stateMsg = campaign.published?
            'lists.campaignList.state.published' :
            'lists.campaignList.state.draft';

        if (campaign.archived) {
            stateMsg = 'lists.campaignList.state.archived'
        }
        else if (campaign.published) {
            stateMsg += '.' + campaign.visibility;
        }

        return (
            <div className={classes}
                onClick={ this.props.onItemClick }>
                <span className="CampaignListItem-title">{campaign.title}</span>
                <span className="CampaignListItem-state">
                    <Msg id={ stateMsg }/>
                </span>
            </div>
        );
    }
}
