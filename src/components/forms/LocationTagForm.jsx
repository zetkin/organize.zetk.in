import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';

export default class LocationTagForm extends React.Component {
    static propTypes = {
        tag: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            info_text: React.PropTypes.string,
        }),
    };

    render() {
        var tag = this.props.tag || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.locationTag.title" name="title"
                    initialValue={ tag.title } maxLength={ 60 }/>
                <TextArea labelMsg="forms.locationTag.info" name="info_text"
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