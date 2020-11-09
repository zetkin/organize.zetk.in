import React from 'react';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';

@injectIntl
export default class TextInput extends InputBase {

    constructor(props) {
    super(props);
    }

    renderInput() {
        let placeholder; 

        if(this.props.placeholder) {
            placeholder = this.props.intl.formatMessage(
                { id: this.props.placeholder });
        }

        const maxLength = this.props.maxLength ? this.props.maxLength : 0

        return (
            <input type="text" maxLength={ maxLength } value={ this.props.value }
                placeholder={ placeholder }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
