import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import SelectInput from '../../../forms/inputs/SelectInput';
import { retrievePersonTags } from '../../../../actions/personTag';
import { createSelection } from '../../../../actions/selection';
import { getListItemsByIds } from '../../../../utils/store';
import { flattenOrgs } from '../../../../utils/import';


@connect(state => ({ 
    subOrgs: state.subOrgs.items,
    activeOrg: state.user.activeMembership.organization,
}))
export default class PersonOrganizationColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    constructor(props) {
        super(props)
        this.orgOptions = flattenOrgs(props.activeOrg, props.subOrgs);
    }

    render() {
        let config = this.props.config;
        let mappings = config.mappings
            .sort((m0, m1) => (m0.value && m1.value)?
                m0.value.toString().localeCompare(m1.value.toString()) : 0);

        return (
            <div className="PersonOrganizationColumnSettings">
                <ul className="PersonOrganizationColumnSettings-mappings">
                { mappings.map(mapping => {
                    let value = mapping.value;
                    let labelMsg = value ?
                        'panes.import.settings.personOrganization.valueLabel' :
                        'panes.import.settings.personOrganization.emptyLabel';

                    return (
                        <li key={ value || 0 }
                            className="PersonOrganizationColumnSettings-mapping">
                            <Msg tagName="h3" id={ labelMsg }
                                values={{ value }} />
                            <SelectInput
                                value={ mapping.org }
                                name={ value }
                                options={ this.orgOptions }
                                optionLabelsAreMessages={ false }
                                onValueChange={ this.onOrganizationChange.bind(this) }
                            />
                        </li>
                    );
                }) }
                </ul>
            </div>
        );
    }

    onOrganizationChange(value, org) {
        let config = this.props.config;
        let oldMapping = config.mappings.find(m => m.value === value);
        let newMapping = Object.assign({}, oldMapping, {
            org: org
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
