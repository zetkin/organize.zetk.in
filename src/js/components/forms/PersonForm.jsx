import React from 'react/addons';

import Form from './Form';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


export default class PersonForm extends React.Component {
    render() {
        var person = this.props.person || {};
        var genderOptions = {
            'f': 'Female',
            'm': 'Male',
            'o': 'Other'
        };


        return (
            <Form ref="form" {...this.props }>
                <TextInput label="First name" name="first_name"
                    initialValue={ person.first_name }/>
                <TextInput label="Last name" name="last_name"
                    initialValue={ person.last_name }/>
                <SelectInput label="Gender" name="gender"
                    options={ genderOptions }
                    initialValue={ person.gender }/>
                <TextInput label="Email" name="email"
                    initialValue={ person.email }/>
                <TextInput label="Phone number" name="phone"
                    initialValue={ person.phone }/>

                <TextInput label="C/o address" name="co_address"
                    initialValue={ person.co_address }/>
                <TextInput label="Street address" name="street_address"
                    initialValue={ person.street_address }/>
                <TextInput label="Zip code" name="zip_code"
                    initialValue={ person.zip_code }/>
                <TextInput label="City" name="city"
                    initialValue={ person.city }/>

                <input name="submit" type="submit"/>
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
