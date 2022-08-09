import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import SelectInput from '../forms/inputs/SelectInput';
import DateInput from '../forms/inputs/DateInput';
import IntInput from '../forms/inputs/IntInput';


@injectIntl
export default class FilterMatchingSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config || { min: 1 });
    }

    render() {
        let option = this.state.option;

        const msg = id => this.props.intl.formatMessage({ id: this.props.labelMsgStem + '.' + id });

        const MATCHING_OPTIONS = {
            'min': msg('options.min'),
            'max': msg('options.max'),
            'between': msg('options.between'),
            'any': msg('options.any'),
            'none': msg('options.none'),
        };

        let minInput = null;
        if (option == 'min' || option == 'between') {
            minInput = (
                <div className="FilterMatchingSelect-min">
                    <Msg tagName="label" id={ msg('min') } />
                    <IntInput key="min" name="min" value={ this.state.min }
                        onValueChange={ this.onChangeField.bind(this) }/>
                </div>
            );
        }
        
        let maxInput = null;
        if (option == 'max' || option == 'between') {
            maxInput = (
                <div className="FilterMatchingSelect-min">
                    <Msg tagName="label" id={ msg('max') } />
                    <IntInput key="max" name="max" value={ this.state.max }
                        onValueChange={ this.onChangeField.bind(this) }/>
                </div>
            );
        }

        return (
            <div className="FilterMatchingSelect">
                <SelectInput key="option" name="option"
                    options={ MATCHING_OPTIONS } value={ this.state.option }
                    onValueChange={ this.onSelectOption.bind(this) } />
                { minInput }
                { maxInput }
            </div>
        );
    }

    onSelectOption(name, value) {
        let min = undefined;
        let max = undefined;

        if (value == 'min') {
            min = this.state.min || 2;
        } else if (value == 'max') {
            max = this.state.max || 5;
        } else if (value == 'between') {
            min = this.state.min || 1;
            max = this.state.max || 5;
        } else if (value == 'any') {
            min = 1;
        } else if (value == 'none') {
            max = 0;
        }
        
        this.setState({ option: value, min: min, max: max }, () =>
            this.dispatchChange());
    }

    onChangeField(name, value) {
        value = parseInt(value);
        let stateChange = { [name]: value };

        this.setState(stateChange, () =>
            this.dispatchChange());
    }

    dispatchChange() {
        if (this.props.onChange) {
            this.props.onChange({
                min: this.state.min,
                max: this.state.max,
            });
        }
    }
}

function stateFromConfig(config) {
    const state = {
        min: config.min,
        max: config.max,
    };

    if (config.min && config.max) {
        state.option = 'between';
    } else if (config.min) {
        if (config.min == 1) {
            state.option = 'any';
        } else {
            state.option = 'min';
        }
    } else if (config.max) {
        if (config.max == 0) {
            state.option = 'none';
        } else {
            state.option = 'max';
        }
    }

    return state;
}
