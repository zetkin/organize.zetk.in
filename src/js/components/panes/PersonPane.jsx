import React from 'react/addons';

import PaneBase from './PaneBase';
import Form from '../form/Form';
import TextInput from '../form/TextInput';
import SelectInput from '../form/SelectInput';


export default class PersonPane extends PaneBase {
    getRenderData() {
        var personId = this.props.params[0];
        var personStore = this.getStore('person');

        return {
            person: personStore.getPerson(personId)
        }
    }

    getPaneTitle(data) {
        if (data.person) {
            return data.person.first_name + ' ' + data.person.last_name;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.person) {
            var genderOptions = {
                'f': 'Female',
                'm': 'Male',
                'o': 'Other'
            };

            return (
                <Form ref="personForm" onSubmit={ this.onSubmit.bind(this) }>
                    <TextInput label="First name" name="first_name"
                        initialValue={ data.person.first_name }/>
                    <TextInput label="Last name" name="last_name"
                        initialValue={ data.person.last_name }/>
                    <SelectInput label="Gender" name="gender"
                        options={ genderOptions }
                        initialValue={ data.person.gender }/>
                    <TextInput label="Email" name="email"
                        initialValue={ data.person.email }/>
                    <TextInput label="Phone number" name="phone"
                        initialValue={ data.person.phone }/>

                    <TextInput label="C/o address" name="co_address"
                        initialValue={ data.person.co_address }/>
                    <TextInput label="Street address" name="street_address"
                        initialValue={ data.person.street_address }/>
                    <TextInput label="Zip code" name="zip_code"
                        initialValue={ data.person.zip_code }/>
                    <TextInput label="City" name="city"
                        initialValue={ data.person.city }/>

                    <input name="submit" type="submit"/>
                </Form>
            );
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        var form = this.refs.personForm;
        var values = form.getValues();

        console.log('all values', values);
        console.log('changed', form.getChangedValues());
    }
}
