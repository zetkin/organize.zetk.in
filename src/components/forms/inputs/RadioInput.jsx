import React from 'react';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';
import makeRandomString from '../../../utils/makeRandomString';


@injectIntl
export default class RadioInput extends InputBase {
    static propTypes = {
        options: React.PropTypes.object.isRequired,
        idPrefix: React.PropTypes.string.isRequired,
        optionLabelsAreMessages: React.PropTypes.bool,
        orderAlphabetically: React.PropTypes.bool,
        nullOption: React.PropTypes.string,
        nullOptionMsg: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    renderInput() {
        let keys = Object.keys(this.props.options);

        if (this.props.orderAlphabetically) {
            keys.sort((k0, k1) => this.props.options[k0].localeCompare(this.props.options[k1]));
        }

        let inputElements = keys.map(key => {
            let label = this.props.options[key];
            let name = this.props.idPrefix + '-' + this.props.name;
            let id = name + '-' + key;

            if (this.props.optionLabelsAreMessages) {
                label = this.props.intl.formatMessage({ id: label });
            }

            return (
                <div key={ key } className="RadioInput-input">
                    <input id={ id } type="radio"
                        name={ name } value={ key }
                        checked={ key == this.props.value }
                        onChange={ this.onChange.bind(this) }
                        />
                    <label htmlFor={ id }>{ label }</label>
                </div>
            );
        });

        if (this.props.nullOption || this.props.nullOptionMsg) {
            let label = this.props.nullOption;
            let name = this.props.idPrefix + '-' + this.props.name;
            let id = name + '-0';

            if (this.props.nullOptionMsg) {
                label = this.props.intl.formatMessage({ id: this.props.nullOptionMsg });
            }

            inputElements.unshift(
                <div key="0" className="RadioInput-input">
                    <input id={ id } type="radio"
                        name={ name } value="key"
                        checked={ this.props.value === null }
                        />
                    <label htmlFor={ id }>{ label }</label>
                </div>
            );
        }

        return inputElements;
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
