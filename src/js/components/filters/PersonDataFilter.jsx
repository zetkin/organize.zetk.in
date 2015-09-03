import React from 'react/addons';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';


export default class PersonDataFilter extends FilterBase {
    renderFilterForm(config) {
        const fieldOptions = {
            '*': 'Any field',
            'first_name': 'First name',
            'last_name': 'Last name',
            'email': 'E-mail address',
            'phone': 'Phone number',
            'co_address': 'C/o address',
            'street_address': 'Street address',
            'zip': 'Zip code',
            'city': 'City'
        };

        return (
            <Form ref="form" onSubmit={ this.onFormSubmit.bind(this) }>
                <SelectInput label="Match" name="field"
                    options={ fieldOptions }
                    initialValue={ config.field }/>
                <TextInput label="Against" name="text"
                    initialValue={ config.text }/>
                <input type="submit"/>
            </Form>
        );
    }
}
