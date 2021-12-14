import React from 'react';

import FilterBase from './FilterBase';
import IntInput from '../forms/inputs/IntInput';
import FilterTimeFrameSelect from './FilterTimeFrameSelect';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import Button from '../misc/Button';
import { injectIntl } from 'react-intl';

@injectIntl
export default class MostActiveFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            size: props.config.size || 20,
            after: props.config.after,
            before: props.config.before,
        };
    }

    componentWillReceiveProps({ config }) {
        if (config !== this.props.config) {
            this.setState(config);
        }
    }

    renderFilterForm(config) {
        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,

            <IntInput key="size" name="size"
                className="MostActiveFilter-size"
                labelMsg="filters.mostActive.size"
                value={ this.state.size }
                onValueChange={ this.onSizeChange.bind(this) }
            />,

            <FilterTimeFrameSelect key="timeframe"
                config={ this.state }
                labelMsgStem="filters.mostActive.timeframe"
                onChange={ this.onChangeTimeFrame.bind(this) }
                />,
        ];
    }

    onChangeTimeFrame({ before, after }) {
        this.setState({ before, after }, () => this.onConfigChange());
    }

    onSizeChange(name, size) {
        this.setState({ size }, () => this.onConfigChange());
    }

    getConfig = () => ({
        size: parseInt(this.state.size),
        after: this.state.after,
        before: this.state.before,
        organizationOption: this.state.organizationOption,
        specificOrganizations: this.state.specificOrganizations,
    })

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}
