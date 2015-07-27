import React from 'react/addons';

import InputBase from './InputBase';


export default class TextArea extends InputBase {
    renderInput() {
        return (
            <textarea value={ this.props.value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
