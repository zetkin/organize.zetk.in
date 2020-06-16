import React from 'react';

import InputBase from './InputBase';


export default class IntInput extends InputBase {
    static propTypes = {
        initialValue: React.PropTypes.number,
    };

    renderInput() {
        let constraints = Object.assign({}, this.props.constraints);
        constraints.min = 'min' in constraints ? constraints.min : 0;
        constraints.step = 'step' in constraints ? constraints.step : 1;

        return (
            <input type="number"
                value={ this.props.value }
                {...constraints}
                onChange={ this.onChange.bind(this) }/>
        );
    }
}
