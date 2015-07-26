import React from 'react/addons';

import InputBase from './InputBase';


export default class TextInput extends InputBase {
    renderInput() {
        return (
            <input type="text" value={ this.props.value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
