import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';

export default class AllFilter extends FilterBase {
    constructor(props) {
        super(props)

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromConfig(nextProps.config));
    }

    renderFilterForm(config) {
        return (
            <div>
                <Msg id="filters.all.description"/>
                <FilterOrganizationSelect
                    config={ config } 
                    openPane={ this.props.openPane }
                    onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                    />
            </div>
        );
    }s

    getConfig() {
        return {
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}

function stateFromConfig(config) {
    return {
        organizationOption: config.organizationOption || 'current',
        specificOrganizations: config.specificOrganizations || [],
    }
}
