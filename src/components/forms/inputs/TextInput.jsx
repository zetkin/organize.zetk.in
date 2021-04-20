import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';

@injectIntl
export default class TextInput extends InputBase {
    componentDidMount() {
        if (this.props.autoFocus) {
            const input = ReactDOM.findDOMNode(this.refs.input);
            if (input) {
                input.focus();
            }
        }
    }

    renderInput() {
        let placeholder; 

        if(this.props.placeholder) {
            placeholder = this.props.intl.formatMessage(
                { id: this.props.placeholder });
        }

        return (
            <input type="text" ref="input"
                maxLength={ this.props.maxLength } value={ this.props.value }
                placeholder={ placeholder }
                onFocus={ this.props.onFocus }
                onChange={ this.onChange.bind(this) }
                onBlur={ this.onBlur.bind(this) }/>
        );
    }
}
