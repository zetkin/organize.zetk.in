import React from 'react/addons';

import InputBase from './InputBase';


export default class RelSelectInput extends InputBase {
    renderInput() {
        return (
            <select value={ this.props.value }
                onChange={ this.onChange.bind(this) }>

                {this.props.objects.map(function(obj) {
                    var value = obj[this.props.valueField];
                    var label = obj[this.props.labelField];

                    return <option key={ value } value={ value }>
                        { label }</option>;
                }, this)}
            </select>
        );
    }
}

RelSelectInput.propTypes = {
    objects: React.PropTypes.array.isRequired,
    valueField: React.PropTypes.string,
    labelField: React.PropTypes.string
};

RelSelectInput.defaultProps = {
    valueField: 'id',
    labelField: 'title'
};
