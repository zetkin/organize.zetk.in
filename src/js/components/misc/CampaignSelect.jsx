import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import RelSelectInput from '../forms/inputs/RelSelectInput';


export default class CampaignSelect extends FluxComponent {
    render() {
        const campaigns = this.getStore('campaign').getCampaigns();
        var selected = this.getStore('campaign').getSelectedCampaign();

        if (selected) {
            selected = selected.id;
        }

        return (
            <RelSelectInput value={ selected } objects={ campaigns }
                className='campaignselect'
                showEditLink={ true } allowNull={ true }
                nullLabel="Any campaign"
                onEdit={ this.props.onEdit }
                onCreate={ this.props.onCreate }
                onValueChange={ this.onChange.bind(this) }/>
        );
    }

    onChange(name, value) {
        if (!value) {
            this.getActions('campaign').selectCampaign(null);
        }
        else {
            this.getActions('campaign').selectCampaign(value);
        }
    }
}
