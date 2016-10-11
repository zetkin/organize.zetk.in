import React from 'react';

import InputBase from './InputBase';


export default class IntInput extends InputBase {
    static propTypes = {
        initialValue: React.PropTypes.number,
    };

    renderInput() {
        return (
            <input type="number" step="1" min="0" value={ this.props.value }
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
