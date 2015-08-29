import React from 'react/addons';

import InputBase from './InputBase';


export default class IntInput extends InputBase {
    renderInput() {
        return (
            <input type="number" step="1" min="0" value={ this.props.value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
