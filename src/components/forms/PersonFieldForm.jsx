import React from 'react';

import Form from './Form';
import SelectInput from './inputs/SelectInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class PersonFieldForm extends React.Component {
    static propTypes = {
        field: React.PropTypes.shape({
            title: React.PropTypes.string,
            description: React.PropTypes.string,
            type: React.PropTypes.string,
        }),
    };

    render() {
        const typeOptions = {
            text: 'forms.personField.types.text',
            date: 'forms.personField.types.date',
            url: 'forms.personField.types.url',
        };

        const field = this.props.field;

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.personField.title" name="title"
                    initialValue={ field.title } maxLength={ 60 }/>
                <TextArea labelMsg="forms.personField.description" name="description"
                    initialValue={ field.description }/>
                <SelectInput labelMsg="forms.personField.type.label" name="hidden"
                    initialValue={ field.type }
                    options={ typeOptions }
                    optionLabelsAreMessages={ true }
                    />
            </Form>
        );
    }

    getValues() {
        let values = this.refs.form.getValues();
        return values;
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();
        return values;
    }
}
