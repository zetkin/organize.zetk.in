import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


export default class SurveyQuestionForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        question: React.PropTypes.shape({
            question: React.PropTypes.string,
            description: React.PropTypes.string,
            response_type: React.PropTypes.string,
        }),
    }

    render() {
        let question = this.props.question || {};
        let typeOptions = {
            'text': 'forms.surveyQuestion.responseTypeOptions.text',
            'options': 'forms.surveyQuestion.responseTypeOptions.options',
        };

        return (
            <Form className="SurveyQuestionForm" ref="form" { ...this.props }>
                <TextInput name="question"
                    labelMsg="forms.surveyQuestion.question"
                    initialValue={ question.question }/>
                <TextArea name="description"
                    labelMsg="forms.surveyQuestion.description"
                    initialValue={ question.description }/>
                <SelectInput name="response_type"
                    labelMsg="forms.surveyQuestion.responseType"
                    initialValue={ question.response_type }
                    options={ typeOptions }
                    optionLabelsAreMessages={ true }/>
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
