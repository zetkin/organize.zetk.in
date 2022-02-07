import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import SelectInput from '../forms/inputs/SelectInput';

import { retrieveCallAssignmentsRecursive } from '../../actions/callAssignment';
import { retrieveQueriesRecursive } from '../../actions/query';
import filterByOrg from '../../utils/filterByOrg';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';

const mapStateToProps = state => {
    const assignmentList = state.callAssignments.assignmentList;
    const queryList = state.queries.queryList;
    const orgList = flattenOrganizationsFromState(state);

    return {
        assignmentList,
        queryList,
        orgList,
    };
};


@injectIntl
@connect(mapStateToProps)
export default class SubQueryFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            queryId: props.config.query_id,
            organizationOption: props.config.organizationOptions || 'all',
            specificOrganizations: props.config.specificOrganizations || [],
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveCallAssignmentsRecursive());
        this.props.dispatch(retrieveQueriesRecursive());
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                queryId: nextProps.config.query_id,
                organizationOption: nextProps.config.organizationOption,
                specificOrganizations: nextProps.config.specificOrganizations,
            });
        }
    }

    renderFilterForm(config) {
        const SA_OPTIONS = {}
        let queryItems = this.props.queryList.items || [];
        queryItems = filterByOrg(this.props.orgList, queryItems, this.state)
        queryItems
            .filter(item => item.data.type == 'standalone')
            .forEach(item => {
                const query = item.data;
                SA_OPTIONS[query.id] = query.title;
            });

        const CA_OPTIONS = {}
        let assignmentItems = this.props.assignmentList.items || [];
        assignmentItems = filterByOrg(this.props.orgList, assignmentItems, this.state)
        assignmentItems.forEach(item => {
            const ca = item.data;

            CA_OPTIONS[ca.target.id] = this.props.intl.formatMessage(
                { id: 'filters.subQuery.assignment.target' },
                { assignment: ca.title });

            CA_OPTIONS[ca.goal.id] = this.props.intl.formatMessage(
                { id: 'filters.subQuery.assignment.goal' },
                { assignment: ca.title });
        });

        const saLabel = this.props.intl.formatMessage({ id: 'filters.subQuery.types.standalone' });
        const caLabel = this.props.intl.formatMessage({ id: 'filters.subQuery.types.callAssignment' });
        const OPTIONS = {
            [saLabel]: SA_OPTIONS,
            [caLabel]: CA_OPTIONS,
        };

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
            <SelectInput key="isUser" name="is_user"
                labelMsg="filters.subQuery.queryLabel"
                options={ OPTIONS } value={ this.state.queryId }
                orderAlphabetically={ true }
                onValueChange={ this.onQuerySelect.bind(this) }
                />,
        ];
    }

    getConfig() {
        return {
            query_id: this.state.queryId,
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };
    }

    onQuerySelect(name, value) {
        this.setState({ queryId: value }, () => this.onConfigChange());
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}
