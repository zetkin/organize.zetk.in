import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';


@injectIntl
@connect(state => ({ fieldTypes: state.personFields.fieldTypes }))
export default class PersonDataFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            field: '_',
            search: '',
        };
    }

    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });
        const fieldOptions = this.props.fieldTypes.items.reduce((obj, field) => {
            if(field.data.type !== 'json') {
                obj['person_field.' + field.data.id] = field.data.title;
            }
            return obj;
        }, {});

        fieldOptions['_'] = msg('filters.personField.selectField')

        return [
            <Form key="form" ref="form"
                onValueChange={ this.onConfigChange.bind(this) }>
                <SelectInput key="selectField" name="field"
                    options={ fieldOptions } value={ this.state.field }
                    onValueChange={ this.onChangeField.bind(this) }/>,
                <TextInput key="search" name="search"
                    labelMsg={ fieldOptions[this.state.field] } 
                    onValueChange={ this.onChangeSearch.bind(this) }/>
            </Form>,
        ];
    }

    getConfig() {
        // Only return fields that actually have a value
        let values = this.refs.form.getValues();
       
        return { 
            field: this.state.field,
            operator: 'like',
            search: this.state.search,
        };
    }

    onChangeField(name, value) {
        this.setState({
            field: value,
        });
    }

    onChangeSearch(name, value) {
        this.setState({
            search: value,
        })
    }
}
