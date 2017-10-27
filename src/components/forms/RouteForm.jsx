import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class RouteForm extends React.Component {
    render() {
        var route = this.props.route || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.route.title" name="title"
                    initialValue={ route.title }/>
                <TextArea labelMsg="forms.route.description" name="info_text"
                    initialValue={ route.info_text }/>
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
