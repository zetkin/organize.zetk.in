import React from 'react';

import Form from './Form';
import SmsMessageInput from './inputs/SmsMessageInput';
import SmsSenderInput from './inputs/SmsSenderInput';
import TextInput from './inputs/TextInput';

export default class SmsDistributionForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        distribution: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            sender: React.PropTypes.string.isRequired,
            message: React.PropTypes.string.isRequired,
        }),
    }

    render() {
        const distribution = this.props.distribution || {};

        return (
            <Form className="SmsDistributionForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.smsDistribution.title" name="title"
                    initialValue={ distribution.title }/>
                <SmsSenderInput labelMsg="forms.smsDistribution.sender" name="sender"
                    initialValue={ distribution.sender }/>
                <SmsMessageInput labelMsg="forms.smsDistribution.message" name="message"
                    initialValue={ distribution.message }/>
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
