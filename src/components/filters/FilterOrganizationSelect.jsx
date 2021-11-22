import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import { createSelection } from '../../actions/selection';

import SelectInput from '../forms/inputs/SelectInput';
import OrganizationCloud from '../misc/tagcloud/OrganizationCloud';
import { getListItemById } from '../../utils/store';


const mapStateToProps = state => ({
    subOrgs: state.subOrgs,
    activeOrganization: state.user.activeMembership.organization,
});

@connect(mapStateToProps)
@injectIntl
export default class FilterOrganizationSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    render() {
        if(!(this.props.subOrgs.items && this.props.subOrgs.items.length)) {
            // Don't render this component if there are no suborgs
            return null;
        }

        let organizationOption = this.state.organizationOption;

        const msg = id => this.props.intl.formatMessage({ id: this.props.labelMsgStem + '.' + id });

        const ORGANIZATION_OPTIONS = {
            'current': msg('options.current'),
            'all': msg('options.all'),
            'suborgs': msg('options.suborgs'),
            'specific': msg('options.specific'),
        };

        let specificOrganizationInput = null;
        if (organizationOption == 'specific') {
            if(this.props.subOrgs) {
                const organizationList = getOrganizationList(this.props);
                const organizations = this.state.specificOrganizations
                    .map(orgId => organizationList.find(org => org.id == orgId));
                specificOrganizationInput = (
                    <OrganizationCloud key="organizations"
                        organizations={ organizations }
                        showAddButton={ true } showRemoveButtons={ true }
                        onAdd={ this.onAddOrganization.bind(this) }
                        onRemove={ this.onRemoveOrganization.bind(this) } />
                );
            } else {
                specificOrganizationInput = (
                    <p>Loading</p>
                )
            }
        }

        return (
            <div className="FilterOrganizationSelect">
                <SelectInput key="organization" name="organization"
                    labelMsg={ this.props.labelMsgStem + '.label' }
                    options={ ORGANIZATION_OPTIONS }
                    value={ this.state.organizationOption }
                    onValueChange={ this.onSelectOrganization.bind(this) }/>

                { specificOrganizationInput }
            </div>
        );
    }

    
    onSelectOrganization(name, value) {
        let orgs = this.state.specificOrganizations;
        if(value != 'specific') {
            orgs = []
        }
        const newState = {
            organizationOption: value,
            specificOrganizations: orgs,
        }
        this.setState(newState);
        this.props.onChangeOrganizations(newState);
    }

    onAddOrganization() {
        let action = createSelection('organizations', null, null, ids => {
            // Add new ids, making sure there are no duplicates
            const newOrgs = ids.filter(id => this.state.specificOrganizations.indexOf(id) < 0);
            const orgs = this.state.specificOrganizations.concat(newOrgs);

            const newState = {
                organizationOption: 'specific',
                specificOrganizations: orgs,
            }
            this.setState(newState)
            this.props.onChangeOrganizations(newState);
        });

        this.props.dispatch(action);

        this.props.openPane('selectorganizations', action.payload.id);
    }

    onRemoveOrganization(org) {
        const orgs = this.state.specificOrganizations.filter(id => id != org.id);

        const newState = {
            organizationOption: 'specific',
            specificOrganizations: orgs,
        }
        this.setState(newState)
        this.props.onChangeOrganizations(newState);
    }
}

function getOrganizationList(props) {
    // Concat the list of suborgs with the active organization to make complete list of relevant orgs
    return props.subOrgs.items.map(org => org.data).concat(props.activeOrganization);
}

function stateFromConfig(config) {
    return {
        organizationOption: config.organizationOption || 'current',
        specificOrganizations: config.specificOrganizations || [],
    }
}
