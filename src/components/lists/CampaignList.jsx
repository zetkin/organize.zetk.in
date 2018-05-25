import React from 'react';

import List from './List';
import CampaignListItem from './items/CampaignListItem';


export default class CampaignList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        campaignList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        return (
            <List className="AddressList"
                itemComponent={ CampaignListItem }
                list={ this.props.campaignList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
