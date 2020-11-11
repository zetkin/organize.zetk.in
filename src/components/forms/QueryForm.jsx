import React from 'react';

import Form from './Form';
import TextInput from './inputs/TextInput';
import TextArea from './inputs/TextArea';


export default class QueryForm extends React.Component {
    static propTypes = {
        query: React.PropTypes.shape({
            title: React.PropTypes.string,
            info_text: React.PropTypes.string,
        }).isRequired,
    };

    render() {
        let query = this.props.query || {};

        return (
            <Form ref="form" { ...this.props }>
                <TextInput labelMsg="forms.query.title" name="title"
                    initialValue={ query.title } maxLength={ 120 }/>

                <TextArea labelMsg="forms.query.description" name="info_text"
                    initialValue={ query.info_text }/>
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
