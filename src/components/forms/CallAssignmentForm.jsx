import React from 'react';

import Form from './Form';
import DateInput from './inputs/DateInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class CallAssignmentForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        assignment: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired,
            start_date: React.PropTypes.string.isRequired,
            end_date: React.PropTypes.string.isRequired,
            cooldown: React.PropTypes.number.isRequired,
        }).isRequired,
    }

    render() {
        let assignment = this.props.assignment;

        return (
            <Form className="CallAssignmentForm" ref="form" { ...this.props }>
                <TextInput label="Title" name="title"
                    initialValue={ assignment.title }/>
                <TextArea label="Description" name="description"
                    initialValue={ assignment.description }/>

                <DateInput label="Start date" name="start_date"
                    initialValue={ assignment.start_date }/>
                <DateInput label="End date" name="end_date"
                    initialValue={ assignment.end_date }/>

                <input type="submit" value="Submit"/>
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
