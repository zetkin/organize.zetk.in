import React from 'react';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';


@injectIntl
export default class SelectInput extends InputBase {
    static propTypes = {
        options: React.PropTypes.object.isRequired,
        optionLabelsAreMessages: React.PropTypes.bool,
        orderAlphabetically: React.PropTypes.bool,
        nullOption: React.PropTypes.string,
        nullOptionMsg: React.PropTypes.string,
    };

    renderInput() {
        let keys = Object.keys(this.props.options);

        if (this.props.orderAlphabetically) {
            keys.sort((k0, k1) => this.props.options[k0].localeCompare(this.props.options[k1]));
        }

        let optionElements = keys.map(key => {
            var label = this.props.options[key];

            if (this.props.optionLabelsAreMessages) {
                label = this.props.intl.formatMessage({ id: label });
            }

            return (
                <option key={ key } value={ key }>
                    { label }
                </option>
            );
        });

        if (this.props.nullOption || this.props.nullOptionMsg) {
            let label = this.props.nullOption;
            if (this.props.nullOptionMsg) {
                label = this.props.intl.formatMessage({ id: this.props.nullOptionMsg });
            }

            optionElements.unshift(
                <option key="0" value="0">
                    { label }
                </option>
            );
        }

        return (
            <select value={ this.props.value || '0' }
                onChange={ this.onChange.bind(this) }>
                { optionElements }
            </select>
        );
    }

    onChange(ev) {
        if (ev.target.value == '0' && (this.props.nullOption || this.props.nullOptionMsg)) {
            this.props.onValueChange(this.props.name, null);
        }
        else {
            super.onChange(ev);
        }
    }
}

SelectInput.propTypes = {
    options: React.PropTypes.object.isRequired
}
