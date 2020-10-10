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

        this.state = {
            type: this.props.column? this.props.column.type : 'person_field',
            config: this.props.column? this.props.column.config : {},
        };
    }

    render() {
        const column = Object.assign(this.props.column || {}, {
            type: this.state.type,
            config: this.state.config || {},
        });

        const typeOptions = Object.keys(configComponents).reduce((options, type) => {
            options[type] = `forms.personViewColumn.types.${type}`;
            return options;
        }, {});

        const ConfigComponent = configComponents[column.type];

        return (
            <div className="PersonViewColumnForm">
                <Form key="form" ref="form" { ...this.props }
                    onValueChange={ this.onValueChange.bind(this) }
                    >
                    <TextInput labelMsg="forms.personViewColumn.title" name="title"
                        initialValue={ column.title }/>

                    <TextArea labelMsg="forms.personViewColumn.description" name="description"
                        initialValue={ column.description }/>

                    <SelectInput labelMsg="forms.personViewColumn.type" name="type"
                        options={ typeOptions }
                        optionLabelsAreMessages={ true }
                        initialValue={ column.type }
                        onValueChange={ (field, value) => this.setState({ type: value }) }
                        />
                </Form>,
                <ConfigComponent
                    config={ column.config }
                    onChange={ config => this.setState({ config }) }
                    />
            </div>
        );
    }

    getValues() {
        return Object.assign(this.refs.form.getValues(), this.state);
    }

    getChangedValues() {
        return Object.assign(this.refs.form.getChangedValues(), this.state);
    }

    onValueChange(name, value) {
        if (name == 'type') {
            this.setState({
                type: value,
            });
        }
    }
}

const configComponents = {
    'person_field': ({ config, onChange }) => {
        const FIELDS = [
            'ext_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'alt_phone',
            'co_address',
            'street_address',
            'zip_code',
            'city',
            'country',
        ];

        const fieldOptions = FIELDS.reduce((options, field) => {
            options[field] = `forms.personViewColumn.config.personField.fieldOptions.${field}`;
            return options;
        }, {});

        return (
            <div>
                <SelectInput name="field"
                    labelMsg="forms.personViewColumn.config.personField.field"
                    options={ fieldOptions }
                    optionLabelsAreMessages={ true }
                    value={ config.field }
                    onValueChange={ (name, value) => onChange(Object.assign({}, config, { [name]: value })) }
                    />
            </div>
        );
    },
    'person_tag': ({ config, onChange }) => {
        // TODO: Replace with select
        return (
            <div>
                <IntInput name="tag_id"
                    labelMsg="forms.personViewColumn.config.personTag.tag"
                    value={ config.tag }
                    onValueChange={ (name, value) => onChange(Object.assign({}, config, { [name]: value })) }
                    />
            </div>
        );
    },
};
