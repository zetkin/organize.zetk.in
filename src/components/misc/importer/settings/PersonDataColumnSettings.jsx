import React from 'react';

import SelectInput from '../../../forms/inputs/SelectInput';


const FIELD_OPTIONS = {
    'id': 'Zetkin ID',
    'first_name': 'First name',
    'last_name': 'Last name',
    'email': 'E-mail address',
    'phone': 'Phone number',
    'co_address': 'C/o address',
    'street_address': 'Street address',
    'zip_code': 'Zip code',
    'city': 'City',
    'gender': 'Gender',
};


export default class PersonDataColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    render() {
        let field = this.props.config.field;

        return (
            <div className="PersonDataColumnSettings">
                <h3>Field</h3>
                <p>
                    What Person field does this column represent?
                </p>
                <SelectInput name="field"
                    value={ field } options={ FIELD_OPTIONS }
                    onValueChange={ this.onChangeField.bind(this) }/>
            </div>
        );
    }

    onChangeField(prop, value) {
        if (this.props.onChangeConfig) {
            this.props.onChangeConfig({ field: value });
        }
    }
}
