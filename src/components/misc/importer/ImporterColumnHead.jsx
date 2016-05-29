import React from 'react';


const PERSON_OPTIONS = {
    'person.id': 'Zetkin ID',
    'person.first_name': 'First name',
    'person.last_name': 'Last name',
    'person.email': 'E-mail address',
    'person.phone': 'Phone number',
    'person.co_address': 'C/o address',
    'person.street_address': 'Street address',
    'person.zip_code': 'Zip code',
    'person.city': 'City',
    'person.gender': 'Gender',
};

const COMPLEX_OPTIONS = {
    'person_tag': 'Tag',
};

export default class ImporterColumnHead extends React.Component {
    static propTypes = {
        column: React.PropTypes.object.isRequired,
        onChangeColumn: React.PropTypes.func,
        onEditColumn: React.PropTypes.func,
    };

    render() {
        let column = this.props.column;
        let type = column.type;

        if (type == 'person_data') {
            // Use "person.<field_name>" as the type, which is how it's defined
            // in the PERSON_OPTIONS dictionary.
            type = 'person.' + column.config.field;
        }

        // Show column name, or if none exists, the name of the selected field,
        // or if none was selected, render "n/a".
        let name = column.name
            || PERSON_OPTIONS[type]
            || COMPLEX_OPTIONS[type]
            || 'n/a';

        return (
            <th className="ImporterColumnHead">
                <h3>{ name }</h3>
                <select value={ type }
                    onChange={ this.onChangeColumn.bind(this) }>
                    <option value="unknown" disabled={ true }>Column type</option>
                    <optgroup label="Person fields">
                    { Object.keys(PERSON_OPTIONS).map(value => (
                        <option key={ value } value={ value }>
                            { PERSON_OPTIONS[value] }</option>
                    )) }
                    </optgroup>
                    <optgroup label="Other types">
                    { Object.keys(COMPLEX_OPTIONS).map(value => (
                        <option key={ value } value={ value }>
                            { COMPLEX_OPTIONS[value] }</option>
                    )) }
                    </optgroup>
                </select>
                <a className="ImporterColumnHead-editLink"
                    onClick={ this.onClickEdit.bind(this) }>
                    Edit column settings</a>
            </th>
        );
    }

    onClickEdit() {
        if (this.props.onEditColumn) {
            this.props.onEditColumn(this.props.column);
        }
    }

    onChangeColumn(ev) {
        if (this.props.onChangeColumn) {
            let value = ev.target.value;
            let columnId = this.props.column.id;
            let props = {
                type: value,
            };

            if (value.indexOf('person.') === 0) {
                // This is a short hand for a person_data column with a known
                // field. Convert to the correct type and config
                props.type = 'person_data';
                props.config = {
                    // Field is whatever comes after the dot
                    field: value.substr(7),
                };
            }

            this.props.onChangeColumn(columnId, props);
        }
    }
}
