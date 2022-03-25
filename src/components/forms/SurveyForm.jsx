import React from 'react';

import Form from './Form';
import DateInput from './inputs/DateInput';
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
        let accessOptions = {
            'open': 'forms.survey.accessOptions.open',
            'auth': 'forms.survey.accessOptions.auth',
        };

        let orgAccessOptions = {
            'suborgs': 'forms.survey.orgAccessOptions.suborgs',
            'sameorg': 'forms.survey.orgAccessOptions.sameorg',
        };

        let signatureOptions = {
            'anon': 'forms.survey.signatureOptions.anon',
            'sign': 'forms.survey.signatureOptions.sign',
        };

        let publishedDate;
        if(survey.published) {
            publishedDate = (Date.create(survey.published))
                .setUTC(true)
                .format('{yyyy}-{MM}-{dd}');
        }

        let expiresDate;
        if(survey.expires) {
            expiresDate = (Date.create(survey.expires))
                .setUTC(true)
                .format('{yyyy}-{MM}-{dd}');
        }

        survey.signature = survey.allow_anonymous? 'anon' : 'sign';

        return (
            <Form className="SurveyForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.survey.title" name="title"
                    initialValue={ survey.title } maxLength={ 182 }/>
                <TextArea labelMsg="forms.survey.info_text" name="info_text"
                    initialValue={ survey.info_text }/>
                <SelectInput labelMsg="forms.survey.access" name="access"
                    initialValue={ survey.access }
                    options={ accessOptions } optionLabelsAreMessages={ true }/>
                <SelectInput labelMsg="forms.survey.signature" name="signature"
                    initialValue={ survey.signature }
                    options={ signatureOptions } optionLabelsAreMessages={ true }/>
                <SelectInput labelMsg="forms.survey.orgAccess" name="org_access"
                    initialValue={ survey.org_access }
                    options={ orgAccessOptions } optionLabelsAreMessages={ true }/>
                <DateInput labelMsg="forms.survey.published" name="published"
                    initialValue={ publishedDate }/>
                <DateInput labelMsg="forms.survey.expires" name="expires"
                    initialValue={ expiresDate }/>
            </Form>
        );
    }

    getValues() {
        let values = this.refs.form.getValues();
        values.allow_anonymous = (values.signature == 'anon');
        delete values['signature'];

        return values;
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();
        if ('signature' in values) {
            values.allow_anonymous = (values.signature == 'anon');
            delete values['signature'];
        }

        return values;
    }
}
