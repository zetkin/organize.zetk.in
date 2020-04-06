import React from 'react';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';

@injectIntl
export default class TextInput extends InputBase {
    renderInput() {
        let placeholder;

        if(this.props.placeholder) {
            placeholder = this.props.intl.formatMessage(
                { id: this.props.placeholder });
        }

        return (
            <input type="text" value={ this.props.value }
                placeholder={ placeholder }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
