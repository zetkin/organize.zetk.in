import React from 'react';

import Form from './Form';
import DateInput from './inputs/DateInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import IntInput from './inputs/IntInput';


export default class CanvassAssignmentForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        assignment: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired,
            start_date: React.PropTypes.string.isRequired,
            end_date: React.PropTypes.string.isRequired,
        }),
    }

    render() {
        let assignment = this.props.assignment || {};

        return (
            <Form className="CanvassAssignmentForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.canvassAssignment.title" name="title"
                    initialValue={ assignment.title } maxLength={ 100 }/>
                <TextArea labelMsg="forms.canvassAssignment.description" name="description"
                    initialValue={ assignment.description }/>

                <DateInput labelMsg="forms.canvassAssignment.startDate" name="start_date"
                    initialValue={ assignment.start_date }/>
                <DateInput labelMsg="forms.canvassAssignment.endDate" name="end_date"
                    initialValue={ assignment.end_date }/>
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
