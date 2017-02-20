import React from 'react';

import FilterBase from './FilterBase';
import IntInput from '../forms/inputs/IntInput';
import makeRandomString from '../../utils/makeRandomString';


export default class RandomFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            size: props.config.size || 20,
            seed: props.config.seed || makeRandomString(6),
        };
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                size: nextProps.config.size,
                seed: nextProps.config.seed,
            });
        }
    }

    renderFilterForm(config) {
        return [
            <IntInput key="size" name="size"
                labelMsg="filters.random.size"
                value={ this.state.size }
                onValueChange={ this.onSizeChange.bind(this) }
                />,
        ];
    }

    getConfig() {
        return {
            size: this.state.size,
            seed: this.state.seed,
        };
    }

    onSizeChange(name, value) {
        this.setState({ size: value }, () =>
            this.onConfigChange());
    }
}
