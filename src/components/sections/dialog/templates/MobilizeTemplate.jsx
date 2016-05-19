import React from 'react';

import SelectInput from '../../../forms/inputs/SelectInput';
import AssignmentTemplate from './AssignmentTemplate';


export default class MobilizeTemplate extends React.Component {
    render() {
        let initialValue = undefined;
        let options = this.props.campaigns.reduce((obj, c) => {
            if (!initialValue)
                initialValue = c.id;

            obj[c.id] = c.title;
            return obj;
        }, {});

        return (
            <AssignmentTemplate type="mobilize"
                title="Mobilize" onCreate={ this.onCreate.bind(this) }>
                Call to mobilize people to participate in the campaign
                <SelectInput name="campaign"
                    initialValue={ initialValue }
                    options={ options }/>
            </AssignmentTemplate>
        );
    }

    onCreate(type, values) {
        if (this.props.onCreate) {
            let campaigns = this.props.campaigns;
            values.campaign = campaigns.find(c => c.id == values.campaign);
            this.props.onCreate(type, values);
        }
    }
}
