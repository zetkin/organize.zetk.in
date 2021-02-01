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
            <input type="text" maxLength={ this.props.maxLength } value={ this.props.value }
                placeholder={ placeholder }
                onFocus={ this.props.onFocus }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
