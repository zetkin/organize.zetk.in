import React from 'react';
import { connect } from 'react-redux';

import Form from './Form';
import DateInput from './inputs/DateInput';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


export default class PersonForm extends React.Component {
    render() {
        const { fieldTypes } = this.props;
        if (fieldTypes && fieldTypes.items) {
            var person = this.props.person || {};
            var genderOptions = {
                '_': 'forms.person.genderOptions.unknown',
                'f': 'forms.person.genderOptions.female',
                'm': 'forms.person.genderOptions.male',
                'o': 'forms.person.genderOptions.other',
            };

            if (!person.gender) {
                person.gender = '_';
            }

            const nativeFields = [
                <TextInput labelMsg="forms.person.externalId" key="ext_id" name="ext_id"
                    initialValue={ person.ext_id } maxLength={12}/>,
                <TextInput labelMsg="forms.person.firstName" key="first_name" name="first_name"
                    initialValue={ person.first_name } maxLength={50}/>,
                <TextInput labelMsg="forms.person.lastName" key="last_name" name="last_name"
                    initialValue={ person.last_name } maxLength={50}/>,
                <SelectInput labelMsg="forms.person.gender" key="gender" name="gender"
                    options={ genderOptions }
                    optionLabelsAreMessages={ true }
                    initialValue={ person.gender }/>,
                <TextInput labelMsg="forms.person.email" key="email" name="email"
                    initialValue={ person.email } maxLength={75}/>,
                <TextInput labelMsg="forms.person.phone" key="phone" name="phone"
                    initialValue={ person.phone } maxLength={60}/>,
                <TextInput labelMsg="forms.person.altPhone" key="alt_phone" name="alt_phone"
                    initialValue={ person.alt_phone } maxLength={60}/>,
                <TextInput labelMsg="forms.person.coAddress" key="co_address" name="co_address"
                    initialValue={ person.co_address } maxLength={120}/>,
                <TextInput labelMsg="forms.person.streetAddress" key="street_address" name="street_address"
                    initialValue={ person.street_address } maxLength={120}/>,
                <TextInput labelMsg="forms.person.zip" key="zip_code" name="zip_code"
                    initialValue={ person.zip_code } maxLength={10}/>,
                <TextInput labelMsg="forms.person.city" key="city" name="city"
                    initialValue={ person.city } maxLength={50}/>,
                <TextInput labelMsg="forms.person.country" key="country" name="country"
                    initialValue={ person.country } maxLength={60}/>,
            ];

            const allFields = nativeFields.concat(fieldTypes.items
                .filter(item => ['text', 'date', 'url'].includes(item.data.type))
                .map(item => {
                    const props = {
                        initialValue: person[item.data.slug],
                        key: item.data.slug,
                        label: item.data.title,
                        name: item.data.slug,
                    };

                    if (item.data.type == 'text') {
                        return (
                            <TextInput { ...props }/>
                        );
                    }
                    else if (item.data.type == 'date') {
                        return (
                            <DateInput { ...props }/>
                        );
                    }
                    else if (item.data.type == 'url') {
                        return (
                            <TextInput { ...props }/>
                        );
                    }
                }));

            return (
                <Form ref="form" {...this.props }>
                    { allFields }
                </Form>
            );
        }
    }

    getValues() {
        let values = this.refs.form.getValues();

        if (values.gender == '_') {
            values.gender = null;
        }

        return values;
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();

        if (values.gender == '_') {
            values.gender = null;
        }

        return values;
    }
}
