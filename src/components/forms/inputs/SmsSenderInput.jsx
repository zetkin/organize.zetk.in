import React from 'react';

import InputBase from './InputBase';

const cleanValue = (value = '') => {
    // Only alphanumeric
    value = value.replace(/[^0-9a-zA-Z]/g, '')

    // Max 11 characters
    value = value.slice(0, 11);

    return value;
};

export default class SmsSenderInput extends InputBase {
    renderInput() {
        let value = this.props.value;

        value = cleanValue(value);

        return (
            <input type="text" value={value}
                onChange={this.onChange.bind(this)} />
        );
    }

    onChange(event) {
        let value = event.target.value

        value = cleanValue(value);

        event.target.value = value;

        super.onChange(event);
    }
}
