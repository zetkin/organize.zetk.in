import React from 'react';

import Form from './Form';
import TextInput from './inputs/TextInput';
import TextArea from './inputs/TextArea';


export default class LocationForm extends React.Component {
    render() {
        var loc = this.props.loc || {};

        return (
            <Form ref="form" { ...this.props }>
                <TextInput label="Title" name="title"
                    initialValue={ loc.title }/>

                <TextArea label="Info text" name="info_text"
                    initialValue={ loc.info_text }/>

                <input type="submit"/>
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
