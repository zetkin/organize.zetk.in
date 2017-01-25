import React from 'react';

import FilterBase from './FilterBase';
import IntInput from '../forms/inputs/IntInput';


export default class RandomFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            size: props.config.size || 20,
        };
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                size: nextProps.config.size,
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
        };
    }

    onSizeChange(name, value) {
        this.setState({ size: value }, () =>
            this.onConfigChange());
    }
}
