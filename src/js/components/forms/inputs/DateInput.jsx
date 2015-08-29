import React from 'react/addons';

import InputBase from './InputBase';


export default class DateInput extends InputBase {
    renderInput() {
        const value = this.props.value;

        return (
            <input type="date" value={ value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
