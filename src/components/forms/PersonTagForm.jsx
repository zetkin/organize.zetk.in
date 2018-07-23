import React from 'react';

import Form from './Form';
import SelectInput from './inputs/SelectInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class PersonTagForm extends React.Component {
    static propTypes = {
        tag: React.PropTypes.shape({
            title: React.PropTypes.string,
            description: React.PropTypes.string,
            hidden: React.PropTypes.bool,
        }),
    };

    render() {
        const tag = this.props.tag || {};
        const hidden = tag.hidden? 'hidden' : 'visible';
        const visibilityOptions = {
            hidden: 'forms.personTag.visibility.hidden',
            visible: 'forms.personTag.visibility.visible',
        };

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.personTag.title" name="title"
                    initialValue={ tag.title }/>
                <TextArea labelMsg="forms.personTag.info" name="description"
                    initialValue={ tag.description }/>
                <SelectInput labelMsg="forms.personTag.visibility.label" name="hidden"
                    initialValue={ hidden }
                    options={ visibilityOptions }
                    optionLabelsAreMessages={ true }
                    />
            </Form>
        );
    }

    getValues() {
        let values = this.refs.form.getValues();
        values.hidden = (values.hidden == 'hidden');
        return values;
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();
        if (values.hidden) {
            values.hidden = (values.hidden == 'hidden');
        }
        return values;
    }
}
