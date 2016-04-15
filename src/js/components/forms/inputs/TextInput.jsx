import React from 'react';

import InputBase from './InputBase';


export default class TextInput extends InputBase {
    renderInput() {
        return (
            <input type="text" value={ this.props.value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
