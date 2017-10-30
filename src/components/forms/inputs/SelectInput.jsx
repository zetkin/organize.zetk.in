import React from 'react';
import { injectIntl } from 'react-intl';

import InputBase from './InputBase';


@injectIntl
export default class SelectInput extends InputBase {
    static propTypes = {
        options: React.PropTypes.object.isRequired,
        optionLabelsAreMessages: React.PropTypes.bool,
        orderAlphabetically: React.PropTypes.bool,
    };

    renderInput() {
        let keys = Object.keys(this.props.options);

        if (this.props.orderAlphabetically) {
            keys.sort((k0, k1) => this.props.options[k0].localeCompare(this.props.options[k1]));
        }

        return (
            <select value={ this.props.value }
                onChange={ this.onChange.bind(this) }>

                {keys.map(key => {
                    var label = this.props.options[key];
                    if (this.props.optionLabelsAreMessages) {
                        label = this.props.intl.formatMessage({
                            id: label,
                        });
                    }

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
