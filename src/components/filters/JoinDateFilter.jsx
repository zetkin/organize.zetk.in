import React from 'react';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import DateInput from '../forms/inputs/DateInput';


export default class JoinDateFilter extends FilterBase {
    renderFilterForm(config) {
        const operatorOptions = {
            'lt': 'Before',
            'gt': 'After',
            'eq': 'Exactly on'
        };

        return (
            <Form ref="form" onSubmit={ this.onFormSubmit.bind(this) }>
                <SelectInput label="People who joined" name="operator"
                    options={ operatorOptions }
                    initialValue={ config.operator }/>
                <DateInput label="Date" name="date"
                    initialValue={ config.date }/>
                <input type="submit"/>
            </Form>
        );
    }
}
