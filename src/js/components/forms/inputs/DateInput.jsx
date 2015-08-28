import React from 'react/addons';

import InputBase from './InputBase';


export default class DateInput extends InputBase {
    renderInput() {
        var value = this.props.value;

        function pad(n) {
            return (n<10)? '0' + n : n.toString();
        }

        if (value instanceof Date) {
            value = value.getFullYear() + '-'
                + pad(value.getMonth() + 1) + '-'
                + pad(value.getDate());
        }

        return (
            <input type="date" value={ value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
