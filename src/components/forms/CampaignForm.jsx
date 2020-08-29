import React from 'react';

import Form from './Form';
import SelectInput from './inputs/SelectInput';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class CampaignForm extends React.Component {
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

        let content = [
            <TextInput key="title" labelMsg="forms.campaign.title" name="title"
                initialValue={ campaign.title }/>,
            <SelectInput key="label" labelMsg="forms.campaign.published.label" name="published"
                initialValue={ published }
                options={ publishedOptions }
                optionLabelsAreMessages={ true }
                />,
        ];

        if (campaign.published) {
            content.push(
                <SelectInput key="visibility"
                    labelMsg="forms.campaign.visibility.label" name="visibility"
                    initialValue={ campaign.visibility }
                    options={ visibilityOptions }
                    optionLabelsAreMessages={ true }
                    />
            );
        }

        content.push(
            <TextArea key="info_text" labelMsg="forms.campaign.description" name="info_text"
                initialValue={ campaign.info_text }/>
        );

        return (
            <Form ref="form" {...this.props }>
                { content }
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

