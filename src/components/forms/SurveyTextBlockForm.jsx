import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class SurveyTextBlockForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        textBlock: React.PropTypes.shape({
            header: React.PropTypes.string,
            content: React.PropTypes.string,
        }),
    }

    render() {
        let textBlock = this.props.textBlock || {};

        return (
            <Form className="SurveyTextBlockForm" ref="form" { ...this.props }>
                <TextInput name="header"
                    labelMsg="forms.surveyTextBlock.header"
                    initialValue={ textBlock.header }/>
                <TextArea name="content"
                    labelMsg="forms.surveyTextBlock.content"
                    initialValue={ textBlock.content }/>
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
