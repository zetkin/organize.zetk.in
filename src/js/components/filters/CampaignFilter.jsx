import React from 'react/addons';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';


export default class CampaignFilter extends FilterBase {
    componentDidMount() {
        this.listenTo('campaign', this.forceUpdate);

        const campaignStore = this.getStore('campaign');
        const campaigns = campaignStore.getCampaigns();

        if (campaigns.length == 0) {
            this.getActions('campaign').retrieveCampaigns();
        }
    }

    renderFilterForm(config) {
        const campaignStore = this.getStore('campaign');
        const campaigns = campaignStore.getCampaigns();
        const operatorOptions = {
            'in': 'Participated in',
            'notin': 'Did not participate in'
        };

        return (
            <Form ref="form" onSubmit={ this.onFormSubmit.bind(this) }>
                <SelectInput label="People who" name="operator"
                    options={ operatorOptions }
                    initialValue={ config.operator }/>
                <RelSelectInput label="Which campaign?" name="campaign"
                    showCreateOption={ false } objects={ campaigns }/>
                <input type="submit"/>
            </Form>
        );
    }
}
