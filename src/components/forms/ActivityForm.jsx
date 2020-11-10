import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class ActivityForm extends React.Component {
    render() {
        var activity = this.props.activity || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.activity.title" name="title"
                    initialValue={ activity.title } maxLength={ 50 }/>
                <TextArea labelMsg="forms.activity.description" name="info_text"
                    initialValue={ activity.info_text }/>
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
