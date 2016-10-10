import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class MobilizeTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            campaignId: undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.campaigns && nextProps.campaigns.length) {
            this.setState({
                campaignId: nextProps.campaigns[0].id.toString(),
            });
        }
    }

    render() {
        let configValues = {
            campaignSelect: (
                <select name="campaign" value={ this.state.campaignId }
                    onChange={ this.onChange.bind(this) }>
                { this.props.campaigns.map(c => (
                    <option key={ c.id } value={ c.id.toString() }>
                        { c.title }
                    </option>
                )) }
                </select>
            )
        };

        return (
            <AssignmentTemplate type="mobilize"
                configValues={ configValues }
                onCreate={ this.onCreate.bind(this) }/>
        );
    }

    onChange(ev) {
        this.setState({
            campaignId: ev.target.value,
        });
    }

    onCreate(type) {
        if (this.props.onCreate) {
            let campaigns = this.props.campaigns;
            let config = {
                campaign: campaigns.find(c =>
                    c.id.toString() == this.state.campaignId)
            };

            this.props.onCreate(type, config);
        }
    }
}
