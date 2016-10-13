import React from 'react';

import Form from './Form';
import DateInput from './inputs/DateInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import IntInput from './inputs/IntInput';


export default class CallAssignmentForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        assignment: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired,
            start_date: React.PropTypes.string.isRequired,
            end_date: React.PropTypes.string.isRequired,
            cooldown: React.PropTypes.number.isRequired,
        }),
    }

    render() {
        let assignment = this.props.assignment || {};

        return (
            <Form className="CallAssignmentForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.callAssignment.title" name="title"
                    initialValue={ assignment.title }/>
                <TextArea labelMsg="forms.callAssignment.description" name="description"
                    initialValue={ assignment.description }/>

                <DateInput labelMsg="forms.callAssignment.startDate" name="start_date"
                    initialValue={ assignment.start_date }/>
                <DateInput labelMsg="forms.callAssignment.endDate" name="end_date"
                    initialValue={ assignment.end_date }/>
                <IntInput labelMsg="forms.callAssignment.coolDown"
                    name="cooldown"
                    initialValue={ assignment.cooldown }/>

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
