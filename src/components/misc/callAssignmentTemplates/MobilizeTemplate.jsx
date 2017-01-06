import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class MobilizeTemplate extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected) {
            let campaigns = nextProps.campaigns;
            if (campaigns && campaigns.length && !nextProps.config.campaignId) {
                // Emit default configuration
                nextProps.onConfigChange({
                    campaignId: campaigns[0].id.toString(),
                });
            }
        }
    }

    render() {
        let config = this.props.config;

        return (
            <AssignmentTemplate type="mobilize"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>
                <select name="campaign" value={ config.campaignId }
                    onChange={ this.onChange.bind(this) }>
                { this.props.campaigns.map(c => (
                    <option key={ c.id } value={ c.id.toString() }>
                        { c.title }
                    </option>
                )) }
                </select>
            </AssignmentTemplate>
        );
    }

    onChange(ev) {
        if (this.props.onConfigChange) {
            this.props.onConfigChange({
                campaignId: ev.target.value,
            });
        }
    }
}
