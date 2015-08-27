import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class CampaignSelect extends FluxComponent {
    render() {
        const campaigns = this.getStore('campaign').getCampaigns();
        var selected = this.getStore('campaign').getSelectedCampaign();

        if (selected) {
            selected = selected.id;
        }

        return (
            <select value={ selected }
                onChange={ this.onChange.bind(this) }>

                <option key="all" value="all">Any campaign</option>

            {campaigns.map(function(campaign) {
                return (
                    <option key={ campaign.id } value={ campaign.id }>
                        { campaign.title }</option>
                );
            })}
            </select>
        );
    }

    onChange(ev) {
        const id = ev.target.value;

        if (id === 'all') {
            this.getActions('campaign').selectCampaign(null);
        }
        else {
            this.getActions('campaign').selectCampaign(id);
        }
    }
}
