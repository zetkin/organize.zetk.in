import React from 'react';
import { injectIntl } from 'react-intl';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import DateInput from '../forms/inputs/DateInput';


@injectIntl
export default class JoinDateFilter extends FilterBase {
    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });

        const operatorOptions = {
            'lt': msg('filters.joinDate.opOptions.lt'),
            'gt': msg('filters.joinDate.opOptions.gt'),
            'eq': msg('filters.joinDate.opOptions.eq'),
        };

        return (
            <Form ref="form" onValueChange={ this.onConfigChange.bind(this) }>
                <SelectInput label="People who joined" name="operator"
                    options={ operatorOptions }
                    initialValue={ config.operator }/>
                <DateInput label="Date" name="date"
                    initialValue={ config.date }/>
            </Form>
        );
    }
}
