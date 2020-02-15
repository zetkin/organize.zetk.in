import React from 'react';

import InputBase from './InputBase';


export default class IntInput extends InputBase {
    static propTypes = {
        initialValue: React.PropTypes.number,
    };

    renderInput() {
        this.props.constraints.min = 0;
        this.props.constraints.step = 1;

        return (
            <input type="number"
                value={ this.props.value }
                {...this.props.constraints}
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
