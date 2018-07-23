import React from 'react';

import Form from './Form';
import SelectInput from './inputs/SelectInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class ActivityForm extends React.Component {
    render() {
        const campaign = this.props.campaign || {
            visibility: 'hidden',
        };

        const published = campaign.published? 'published' : 'draft';
        const publishedOptions = {
            published: 'forms.campaign.published.published',
            draft: 'forms.campaign.published.draft',
        };

        const visibilityOptions = {
            hidden: 'forms.campaign.visibility.hidden',
            open: 'forms.campaign.visibility.open',
        };

        return (
            <Form ref="form" {...this.props }>
                <TextInput labelMsg="forms.campaign.title" name="title"
                    initialValue={ campaign.title }/>
                <SelectInput labelMsg="forms.campaign.published.label" name="published"
                    initialValue={ published }
                    options={ publishedOptions }
                    optionLabelsAreMessages={ true }
                    />
                <SelectInput labelMsg="forms.campaign.visibility.label" name="visibility"
                    initialValue={ campaign.visibility }
                    options={ visibilityOptions }
                    optionLabelsAreMessages={ true }
                    />
                <TextArea labelMsg="forms.campaign.description" name="info_text"
                    initialValue={ campaign.info_text }/>
            </Form>
        );
    }

    getValues() {
        let values = this.refs.form.getValues();
        values.published = (values.published == 'published');
        return values;
    }

    getChangedValues() {
        let values = this.refs.form.getChangedValues();
        if (values.published) {
            values.published = (values.published == 'published');
        }
        return values;
    }
}

