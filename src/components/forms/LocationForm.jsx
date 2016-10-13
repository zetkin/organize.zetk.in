import React from 'react';

import Form from './Form';
import TextInput from './inputs/TextInput';
import TextArea from './inputs/TextArea';


export default class LocationForm extends React.Component {
    render() {
        var loc = this.props.loc || {};

        return (
            <Form ref="form" { ...this.props }>
                <TextInput labelMsg="forms.location.title" name="title"
                    initialValue={ loc.title }/>

                <TextArea labelMsg="forms.location.info" name="info_text"
                    initialValue={ loc.info_text }/>
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
