import React from 'react/addons';

import InputBase from './InputBase';


export default class TimeInput extends InputBase {
    renderInput() {
        var value = this.props.value;

        function pad(n) {
            return (n<10)? '0' + n : n.toString();
        }

        if (value instanceof Date) {
            value = pad(value.getUTCHours()) + ':'
                + pad(value.getUTCMinutes());
        }

        return (
            <input type="time" value={ value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
