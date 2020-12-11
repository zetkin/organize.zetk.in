import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class GroupForm extends React.Component {
    static propTypes = {
        group: React.PropTypes.shape({
            title: React.PropTypes.string,
            description: React.PropTypes.string,
        }),
    };

    render() {
        var group = this.props.group || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.group.title" name="title"
                    initialValue={ group.title } maxLength={ 120 }/>
                <TextArea labelMsg="forms.group.description" name="description"
                    initialValue={ group.description }/>
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
