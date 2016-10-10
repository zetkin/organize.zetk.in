import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class PersonTagForm extends React.Component {
    static propTypes = {
        tag: React.PropTypes.shape({
            title: React.PropTypes.string,
            info_text: React.PropTypes.string,
        }),
    };

    render() {
        var tag = this.props.tag || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.personTag.title" name="title"
                    initialValue={ tag.title }/>
                <TextArea labelMsg="forms.personTag.info" name="info_text"
                    initialValue={ tag.info_text }/>
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
