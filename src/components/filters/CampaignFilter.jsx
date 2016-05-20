import React from 'react';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { retrieveCampaigns } from '../../actions/campaign';


@connect(state => ({ campaigns: state.campaigns }))
export default class CampaignFilter extends FilterBase {
    componentDidMount() {
        let campaignList = this.props.campaigns.campaignList;

        if (campaignList.items.length == 0 && !campaignList.isPending) {
            this.props.dispatch(retrieveCampaigns());
        }
    }

    renderFilterForm(config) {
        const campaignStore = this.props.campaigns;
        const campaigns = campaignStore.campaignList.items.map(i => i.data);

        const operatorOptions = {
            'in': 'Participated in',
            'notin': 'Did not participate in'
        };

        return (
            <Form ref="form" onValueChange={ this.onConfigChange.bind(this) }>
                <SelectInput label="People who" name="operator"
                    options={ operatorOptions }
                    initialValue={ config.operator }/>
                <RelSelectInput label="Which campaign?" name="campaign"
                    objects={ campaigns } initialValue={ config.campaign }
                    showCreateOption={ false }/>
            </Form>
        );
    }
}
