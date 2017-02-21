import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


export default class SurveyForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        survey: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            info_text: React.PropTypes.string.isRequired,
            access: React.PropTypes.string.isRequired,
        }),
    }

    render() {
        let survey = this.props.survey || {};
        let options = {
            'open': 'forms.survey.accessOptions.open',
            'auth': 'forms.survey.accessOptions.auth',
        };

        return (
            <Form className="SurveyForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.survey.title" name="title"
                    initialValue={ survey.title }/>
                <TextArea labelMsg="forms.survey.info_text" name="info_text"
                    initialValue={ survey.info_text }/>
                <SelectInput labelMsg="forms.survey.access" name="access"
                    initialValue={ survey.access }
                    options={ options } optionLabelsAreMessages={ true }/>
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
