import React from 'react';

import Form from './Form';
import IntInput from './inputs/IntInput';
import SelectInput from './inputs/SelectInput';
import TextInput from './inputs/TextInput';
import TextArea from './inputs/TextArea';


export default class PersonViewColumnForm extends React.Component {
    static propTypes = {
        column: React.PropTypes.shape({
            title: React.PropTypes.string,
            description: React.PropTypes.string,
            type: React.PropTypes.string,
            config: React.PropTypes.object,
        }).isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const column = this.props.column;

        return (
            <div className="PersonViewColumnForm">
                <Form key="form" ref="form" { ...this.props }>
                    <TextInput labelMsg="forms.personViewColumn.title" name="title"
                        initialValue={ column.title }/>

                    <TextArea labelMsg="forms.personViewColumn.description" name="description"
                        initialValue={ column.description || '' }/>
                </Form>
            </div>
        );
    }

    getValues() {
        return Object.assign(this.refs.form.getValues(), this.state);
    }

    getChangedValues() {
        return Object.assign(this.refs.form.getChangedValues(), this.state);
    }
}
