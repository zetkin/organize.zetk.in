import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import SelectInput from '../../../forms/inputs/SelectInput';


@injectIntl
export default class PersonDataColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    render() {
        let field = this.props.config.field;

        const col = id => this.props.intl.formatMessage(
            { id: 'panes.import.settings.personData.fields.' + id })

        const FIELD_OPTIONS = {
            'id': col('id'),
            'first_name': col('firstName'),
            'last_name': col('lastName'),
            'email': col('email'),
            'phone': col('phone'),
            'co_address': col('coAddress'),
            'street_address': col('streetAddress'),
            'zip_code': col('zip'),
            'city': col('city'),
            'gender': col('gender'),
        };


        return (
            <div className="PersonDataColumnSettings">
                <Msg tagName="h3" id="panes.import.settings.personData.h"/>
                <Msg tagName="p"
                    id="panes.import.settings.personData.instructions"/>
                <SelectInput name="field"
                    value={ field } options={ FIELD_OPTIONS }
                    onValueChange={ this.onChangeField.bind(this) }/>
            </div>
        );
    }

    onChangeField(prop, value) {
        if (this.props.onChangeConfig) {
            this.props.onChangeConfig({ field: value });
        }
    }
}
