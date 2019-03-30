import React from 'react';

import FilterBase from './FilterBase';
import IntInput from '../forms/inputs/IntInput';
import SelectInput from '../forms/inputs/SelectInput';
import Button from '../misc/Button';
import { injectIntl } from 'react-intl';

@injectIntl
export default class MostActiveFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            size: props.config.size || 20,
        };
    }

    componentWillReceiveProps({ config }) {
        if (config.size != this.state.size) {
            this.setState(config);
        }
    }

    renderFilterForm(config) {
        return [
            <IntInput key="size" name="size"
                className="MostActiveFilter-size"
                labelMsg="filters.mostActive.size"
                value={ this.state.size }
                onValueChange={ this.onSizeChange.bind(this) }
            />
        ];
    }

    onSizeChange(name, size) {
        this.setState({ size }, () => this.onConfigChange());
    }

    getConfig = () => ({
        size: parseInt(this.state.size),
    })
}
