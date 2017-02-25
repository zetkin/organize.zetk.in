import React from 'react';
import { injectIntl } from 'react-intl';
import cx from 'classnames';

import Link from '../Link';
import { resolveSummaryComponent } from './summary';


@injectIntl
export default class ImporterColumnHead extends React.Component {
    static propTypes = {
        column: React.PropTypes.object.isRequired,
        onChangeColumn: React.PropTypes.func,
        onEditColumn: React.PropTypes.func,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;
        const col = id => formatMessage({ id: 'panes.import.column.' + id });

        const PERSON_OPTIONS = {
            'person.first_name': col('colOptions.person.firstName'),
            'person.last_name': col('colOptions.person.lastName'),
            'person.email': col('colOptions.person.email'),
            'person.phone': col('colOptions.person.phone'),
            'person.co_address': col('colOptions.person.coAddress'),
            'person.street_address': col('colOptions.person.streetAddress'),
            'person.zip_code': col('colOptions.person.zip'),
            'person.city': col('colOptions.person.city'),
            'person.gender': col('colOptions.person.gender'),
        };

        const COMPLEX_OPTIONS = {
            'person_tag': col('colOptions.complex.tag'),
        };

        let column = this.props.column;
        let type = column.type;

        if (type == 'id') {
            type = 'id.' + column.config.origin;
        }
        else if (type == 'person_data') {
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

        let summary = null;
        let SummaryComponent = resolveSummaryComponent(column.type);
        if (SummaryComponent) {
            summary = <SummaryComponent column={ column }/>;
        }

        let unknownLabel = col('unknown');
        let idLabel = col('colOptions.id.zetkin');
        let extIdLabel = col('colOptions.id.external');
        let idFieldsLabel = formatMessage(
            { id: 'panes.import.column.idFields' });
        let personFieldsLabel = formatMessage(
            { id: 'panes.import.column.personFields' });

        let otherFieldsLabel = formatMessage(
            { id: 'panes.import.column.otherFields' });

        let isUnknown = (type == "unknown" ? "unknown" : "");

        const classes = cx(
            "ImporterColumnHead",
            isUnknown
        );

        return (
            <th className={ classes }>
                <h3 className="ImporterColumnHead-name">{ name }</h3>
                <select value={ type }
                    onChange={ this.onChangeColumn.bind(this) }>
                    <option value="unknown">{ unknownLabel }</option>
                    <optgroup label={ idFieldsLabel }>
                        <option value="id.zetkin">{ idLabel }</option>
                        <option value="id.external">{ extIdLabel }</option>
                    </optgroup>
                    <optgroup label={ personFieldsLabel }>
                    { Object.keys(PERSON_OPTIONS).map(value => (
                        <option key={ value } value={ value }>
                            { PERSON_OPTIONS[value] }</option>
                    )) }
                    </optgroup>
                    <optgroup label={ otherFieldsLabel }>
                    { Object.keys(COMPLEX_OPTIONS).map(value => (
                        <option key={ value } value={ value }>
                            { COMPLEX_OPTIONS[value] }</option>
                    )) }
                    </optgroup>
                </select>
                <div className="ImporterColumnHead-summary">
                    { summary }
                </div>
                <Link className="ImporterColumnHead-editLink"
                    msgId="panes.import.column.editSettingsLink"
                    onClick={ this.onClickEdit.bind(this) }/>
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

            if (value.indexOf('id.') === 0) {
                props.type = 'id';
                props.config = {
                    origin: value.substr(3),
                };
            }
            else if (value.indexOf('person.') === 0) {
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
