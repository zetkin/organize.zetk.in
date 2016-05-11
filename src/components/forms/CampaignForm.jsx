import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class ActivityForm extends React.Component {
    render() {
        var campaign = this.props.campaign || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput label="Title" name="title"
                    initialValue={ campaign.title }/>
                <TextArea label="Description" name="info_text"
                    initialValue={ campaign.info_text }/>

                <input key="submit" type="submit"/>
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

