import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class PersonGenderColumnValue extends React.Component {
    genderOptions = {
        '_': 'panes.import.settings.personGender.unknown',
        'f': 'panes.import.settings.personGender.female',
        'm': 'panes.import.settings.personGender.male',
        'o': 'panes.import.settings.personGender.other',
    }

    render() {
        let value = this.props.value;
        let config = this.props.column.config;

        let mapping = config.mappings.find(m => m.value == value);
        let gender = mapping && mapping.gender ? mapping.gender : '_';

        return (
            <Msg id={ this.genderOptions[gender] } />
        );
    }
}
