import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class ActivityForm extends React.Component {
    render() {
        var campaign = this.props.campaign || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.campaign.title" name="title"
                    initialValue={ campaign.title }/>
                <TextArea labelMsg="forms.campaign.description" name="info_text"
                    initialValue={ campaign.info_text }/>

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

