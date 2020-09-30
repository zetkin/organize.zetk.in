import React from 'react';
import { injectIntl } from 'react-intl';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';


@injectIntl
export default class PersonDataFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            // Show first_name field if there are no fields in config
            nextField: (Object.keys(props.config).length == 0)?
                'first_name' : undefined,
        };
    }

    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });
        const fieldMessages = {
            'first_name': 'filters.personData.fields.first_name',
            'last_name': 'filters.personData.fields.last_name',
            'email': 'filters.personData.fields.email',
            'phone': 'filters.personData.fields.phone',
            'co_address': 'filters.personData.fields.co_address',
            'street_address': 'filters.personData.fields.street_address',
            'zip_code': 'filters.personData.fields.zip',
            'city': 'filters.personData.fields.city',
            'country': 'filters.personData.fields.country',
        };

        let fields = config.fields || {};
        let fieldInputs = Object.keys(fields).map(field => (
            <TextInput key={ field } name={ field }
                labelMsg={ fieldMessages[field] }
                initialValue={ fields[field] }/>
        ));

        // If there is a next field defined (and it has not already been added
        // by the user) add it to the end of the fields.
        if (this.state.nextField && !(this.state.nextField in fields)) {
            let field = this.state.nextField;
            fieldInputs.push(
                <TextInput key={ field } name={ field }
                    labelMsg={ fieldMessages[field] }
                    initialValue={ fields[field] }/>
            );
        }

        let remainingOptions = {
            '_': msg('filters.personData.selectFields'),
        };

        Object.keys(fieldMessages).forEach(field => {
            if (!(field in fields))
                remainingOptions[field] = msg(fieldMessages[field]);
        });

        return [
            <Form key="form" ref="form"
                onValueChange={ this.onConfigChange.bind(this) }>
                { fieldInputs }
            </Form>,
            <SelectInput key="newField" name={ 'new_field' }
                options={ remainingOptions } value="_"
                onValueChange={ this.onAddNewField.bind(this) }/>
        ];
    }

    getConfig() {
        // Only return fields that actually have a value
        let values = this.refs.form.getValues();
        let fields = Object.keys(values).reduce((o, f) => {
            if (values[f])
                o[f] = values[f];
            return o;
        }, {});

        return { fields };
    }

    onAddNewField(name, value) {
        this.setState({
            nextField: value,
        });
    }
}
