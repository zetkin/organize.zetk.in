import React from 'react/addons';

import InputBase from './InputBase';


export default class TimeInput extends InputBase {
    renderInput() {
        const value = this.props.value;

        return (
            <input type="time" value={ value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
