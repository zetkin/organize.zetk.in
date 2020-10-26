import React from 'react';

import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';


export default class JoinFormForm extends React.Component {
    static propTypes = {
        onSubmit: React.PropTypes.func,
        form: React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired,
        }),
    }

    render() {
        const form = this.props.form || {
            renderable: true,
            embeddable: false,
        };

        const accessOptions = {
            'api': 'forms.joinForm.accessOptions.api',
            'render': 'forms.joinForm.accessOptions.render',
            'embed': 'forms.joinForm.accessOptions.embed',
        };

        if (form.renderable && form.embeddable) {
            form.access = 'embed';
        }
        else if (form.renderable) {
            form.access = 'render';
        }
        else {
            form.access = 'api';
        }

        return (
            <Form className="JoinFormForm" ref="form" { ...this.props }>
                <TextInput labelMsg="forms.joinForm.title" name="title"
                    initialValue={ form.title }/>
                <TextArea labelMsg="forms.joinForm.description" name="description"
                    initialValue={ form.description }/>
                <SelectInput labelMsg="forms.joinForm.access" name="access"
                    initialValue={ form.access }
                    options={ accessOptions } optionLabelsAreMessages={ true }/>
            </Form>
        );
    }

    processAccess(values) {
        if ('access' in values) {
            if (values.access == 'api') {
                values.renderable = false;
                values.embeddable = false;
            }
            else if (values.access == 'render') {
                values.renderable = true;
                values.embeddable = false;
            }
            else if (values.access == 'embed') {
                values.renderable = true;
                values.embeddable = true;
            }

            delete values['access'];
        }

        return values;
    }

    getValues() {
        const values = this.refs.form.getValues();
        return this.processAccess(values);
    }

    getChangedValues() {
        const values = this.refs.form.getChangedValues();
        return this.processAccess(values);
    }
}
