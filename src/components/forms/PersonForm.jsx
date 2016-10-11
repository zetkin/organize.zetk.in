import React from 'react';
import { injectIntl } from 'react-intl';

import Form from './Form';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


@injectIntl
export default class PersonForm extends React.Component {
    render() {
        const msg = id => this.props.intl.formatMessage({ id });

        var person = this.props.person || {};
        var genderOptions = {
            'f': msg('forms.person.genderOptions.female'),
            'm': msg('forms.person.genderOptions.male'),
            'o': msg('forms.person.genderOptions.other'),
        };

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.person.firstName" name="first_name"
                    initialValue={ person.first_name }/>
                <TextInput labelMsg="forms.person.lastName" name="last_name"
                    initialValue={ person.last_name }/>
                <SelectInput labelMsg="forms.person.gender" name="gender"
                    options={ genderOptions }
                    initialValue={ person.gender }/>
                <TextInput labelMsg="forms.person.email" name="email"
                    initialValue={ person.email }/>
                <TextInput labelMsg="forms.person.phone" name="phone"
                    initialValue={ person.phone }/>

                <TextInput labelMsg="forms.person.coAddress" name="co_address"
                    initialValue={ person.co_address }/>
                <TextInput labelMsg="forms.person.streetAddress" name="street_address"
                    initialValue={ person.street_address }/>
                <TextInput labelMsg="forms.person.zip" name="zip_code"
                    initialValue={ person.zip_code }/>
                <TextInput labelMsg="forms.person.city" name="city"
                    initialValue={ person.city }/>

            </Form>
        );
    }

    getValues() {
        return this.refs.form.getValues();
    }

    getChangedValues() {
        return this.refs.form.getChangedValues();
    }
}
