import React from 'react';
import { connect } from 'react-redux';

import RelSelectInput from '../forms/inputs/RelSelectInput';
import { selectCampaign } from '../../actions/campaign';


@connect(state => state)
export default class CampaignSelect extends React.Component {
    render() {
        let campaignStore = this.props.campaigns;
        let campaigns = campaignStore.campaignList.items.map(i => i.data);
        let selectedId = campaignStore.selectedCampaign;

        return (
            <RelSelectInput value={ selectedId } objects={ campaigns }
                className='CampaignSelect'
                showEditLink={ true } allowNull={ true }
                nullLabel="Any campaign"
                onEdit={ this.props.onEdit }
                onCreate={ this.props.onCreate }
                onValueChange={ this.onChange.bind(this) }/>
        );
    }

    onChange(name, value) {
        if (!value) {
            this.props.dispatch(selectCampaign(null));
        }
        else {
            this.props.dispatch(selectCampaign(value));
        }
    }
}
