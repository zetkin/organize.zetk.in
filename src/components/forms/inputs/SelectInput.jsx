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
        let optionElements = this.elementsFromObject(this.props.options);

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

    elementsFromObject(obj) {
        let keys = Object.keys(obj);

        if (this.props.orderAlphabetically) {
            keys.sort((k0, k1) => {
                let s0 = obj[k0];
                let s1 = obj[k1];

                if (typeof s0 != 'string') {
                    s0 = k0;
                }
                if (typeof s1 != 'string') {
                    s1 = k1;
                }

                return s0.localeCompare(s1);
            });
        }

        return keys.map(key => {
            var content = obj[key];

            if (typeof content == 'string') {
                // Strings are <option> elements, optionally localized
                if (this.props.optionLabelsAreMessages) {
                    content = this.props.intl.formatMessage({ id: content });
                }

                return (
                    <option key={ key } value={ key }>
                        { content }
                    </option>
                );
            }
            else {
                // Non-strings must be objects, and are interpreted as
                // <optgroup> elements, optionally localized
                let label = key;
                if (this.props.optionLabelsAreMessages) {
                    label = this.props.intl.formatMessage({ id: label });
                }

                return (
                    <optgroup key={ key } label={ label }>
                        { this.elementsFromObject(content) }
                    </optgroup>
                );
            }
        });
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
