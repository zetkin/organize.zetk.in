import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import RelSelectInput from '../forms/inputs/RelSelectInput';


@connect(state => state)
@injectIntl
export default class CampaignSelect extends React.Component {
    render() {
        let campaignStore = this.props.campaigns;
        let campaigns = campaignStore.campaignList.items.map(i => i.data);

        let nullLabel = this.props.intl.formatMessage(
            { id: 'misc.campaignSelect.nullLabel' });

        return (
            <div>
                <Msg tagName="label" id="misc.campaignSelect.header" />
                <RelSelectInput value={ this.props.value } objects={ campaigns }
                    name="campaign"
                    className='CampaignSelect'
                    showEditLink={ true } allowNull={ true }
                    nullLabel={ nullLabel }
                    onEdit={ this.props.onEdit }
                    onCreate={ this.props.onCreate }
                    onValueChange={ this.onChange.bind(this) }/>
            </div>
        );
    }

    onChange(name, value) {
        if (this.props.onSelect) {
            this.props.onSelect(value? value : null);
        }
    }
}
