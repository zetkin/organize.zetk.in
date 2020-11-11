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

    constructor(props) {
        super(props);

        this.state = {
            responseType: props.question?
                props.question.response_type : 'text',
        };
    }

    render() {
        let question = this.props.question || {
            response_type: 'text',
            response_config: {},
        };

        let typeOptions = {
            'text': 'forms.surveyQuestion.responseTypeOptions.text',
            'options': 'forms.surveyQuestion.responseTypeOptions.options',
        };

        let responseConfig = null;

        if (this.state.responseType == 'text') {
            let widgetOptions = {
                'single': 'forms.surveyQuestion.textWidgetOptions.single',
                'multi': 'forms.surveyQuestion.textWidgetOptions.multi',
            };

            let value = question.response_config.multiline? 'multi' : 'single';

            responseConfig = (
                <SelectInput name="textWidget"
                    labelMsg="forms.surveyQuestion.textWidget"
                    initialValue={ value }
                    options={ widgetOptions }
                    optionLabelsAreMessages={ true }/>
            );
        }
        else if (this.state.responseType == 'options') {
            let widgetOptions = {
                'radio': 'forms.surveyQuestion.optionsWidgetOptions.radio',
                'select': 'forms.surveyQuestion.optionsWidgetOptions.select',
                'checkbox': 'forms.surveyQuestion.optionsWidgetOptions.checkbox',
            };

            responseConfig = (
                <SelectInput name="optionsWidget"
                    labelMsg="forms.surveyQuestion.optionsWidget"
                    initialValue={ question.response_config.widget_type }
                    options={ widgetOptions }
                    optionLabelsAreMessages={ true }/>
            );
        }

        return (
            <Form className="SurveyQuestionForm" ref="form"
                onValueChange={ this.onValueChange.bind(this) }
                { ...this.props }>
                <TextInput name="question"
                    labelMsg="forms.surveyQuestion.question"
                    initialValue={ question.question } maxLength={ 256 }/>
                <TextArea name="description"
                    labelMsg="forms.surveyQuestion.description"
                    initialValue={ question.description }/>
                <SelectInput name="response_type"
                    labelMsg="forms.surveyQuestion.responseType"
                    initialValue={ question.response_type }
                    options={ typeOptions }
                    optionLabelsAreMessages={ true }/>
                { responseConfig }
            </Form>
        );
    }

    onValueChange(name, value) {
        if (name == 'response_type') {
            this.setState({
                responseType: value,
            });
        }

        if (this.props.onValueChange) {
            this.props.onValueChange(name, value);
        }
    }

    decorateValues(values) {
        if (values.textWidget) {
            values.response_config = values.response_config || {}
            if (this.state.responseType == 'text') {
                values.response_config.multiline = (values.textWidget == 'multi');
            }

            delete values['textWidget'];
        }

        if (values.optionsWidget) {
            values.response_config = values.response_config || {}
            if (this.state.responseType == 'options') {
                values.response_config.widget_type = values.optionsWidget;
            }

            delete values['optionsWidget'];
        }

        return values;
    }

    getValues() {
        let values = this.refs.form.getValues();

        return this.decorateValues(values);
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();

        return this.decorateValues(values);
    }
}
