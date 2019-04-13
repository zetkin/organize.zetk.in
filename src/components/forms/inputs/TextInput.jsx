import React from 'react';

import InputBase from './InputBase';


export default class TextInput extends InputBase {
    renderInput() {
        const {
            minlength,
            maxlength,
            value,
        } = this.props;

        return (
            <input type="text" value={ value } minLength={ minlength }
                maxLength={ maxlength } onChange={ this.onChange.bind(this) }/>
        );
    }
}
