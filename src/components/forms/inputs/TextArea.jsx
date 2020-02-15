import React from 'react';

import InputBase from './InputBase';


export default class TextArea extends InputBase {
    renderInput() {
        return (
            <textarea value={ this.props.value }
                {...this.props.constraints}
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
