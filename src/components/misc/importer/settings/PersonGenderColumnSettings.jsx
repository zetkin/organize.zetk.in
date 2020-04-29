import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import SelectInput from '../../../forms/inputs/SelectInput';
import { retrievePersonTags } from '../../../../actions/personTag';
import { createSelection } from '../../../../actions/selection';
import { getListItemsByIds } from '../../../../utils/store';


@connect(state => ({ personTags: state.personTags }))
export default class PersonGenderColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    genderOptions = {
        '_': 'panes.import.settings.personGender.unknown',
        'f': 'panes.import.settings.personGender.female',
        'm': 'panes.import.settings.personGender.male',
        'o': 'panes.import.settings.personGender.other',
    }

    render() {
        let config = this.props.config;
        let mappings = config.mappings
            .sort((m0, m1) => (m0.value && m1.value)?
                m0.value.toString().localeCompare(m1.value.toString()) : 0);

        return (
            <div className="PersonGenderColumnSettings">
                <ul className="PersonGenderColumnSettings-mappings">
                { mappings.map(mapping => {
                    let value = mapping.value;
                    let labelMsg = value?
                        'panes.import.settings.personGender.valueLabel' :
                        'panes.import.settings.personGender.emptyLabel';

                    return (
                        <li key={ value || 0 }
                            className="PersonGenderColumnSettings-mapping">
                            <Msg tagName="h3" id={ labelMsg }
                                values={{ value }} />
                            <SelectInput
                                value={ mapping.gender }
                                name={ value }
                                options={ this.genderOptions }
                                optionLabelsAreMessages={ true }
                                onValueChange={ this.onGenderChange.bind(this) }
                            />
                        </li>
                    );
                }) }
                </ul>
            </div>
        );
    }

    onGenderChange(value, gender) {
        let config = this.props.config;
        let oldMapping = config.mappings.find(m => m.value === value);
        let newMapping = Object.assign({}, oldMapping, {
            gender: gender
        });

        config = Object.assign({}, config, {
            mappings: config.mappings.map(m =>
                (m.value === value) ? newMapping : m),
        });

        if (this.props.onChangeConfig) {
            this.props.onChangeConfig(config);
        }
    }
}
