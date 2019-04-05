import React from 'react';

import InputBase from './InputBase';

import CommonPhoneInput from '../../../common/misc/PhoneInput'

export default class PhoneInput extends InputBase {
    renderInput() {
        return (
            <CommonPhoneInput
                value={ this.props.value }
                onChange={ this.onChange.bind(this) }
            />
        );
    }
}
