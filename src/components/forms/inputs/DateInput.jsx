import React from 'react';

import InputBase from './InputBase';


export default class DateInput extends InputBase {
    renderInput() {
        const value = this.props.value || '';

        return (
            <div className="DateInput">
                <input type="date" value={ value }
                    onChange={ this.onChange.bind(this) }/>
            </div>
        );
    }
}
