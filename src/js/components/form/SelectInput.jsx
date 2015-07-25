import React from 'react/addons';

import InputBase from './InputBase';


export default class SelectInput extends InputBase {
    renderInput() {
        return (
            <select value={ this.props.value }
                onChange={ this.onChange.bind(this) }>

                {Object.keys(this.props.options).map(function(key) {
                    var label = this.props.options[key];
                    return <option key={ key } value={ key }>
                        { label }</option>;
                }, this)}
            </select>
        );
    }
}

SelectInput.propTypes = {
    options: React.PropTypes.object.isRequired
}
