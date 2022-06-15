import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import DateInput from '../forms/inputs/DateInput';
import IntInput from '../forms/inputs/IntInput';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import FilterMatchingSelect from './FilterMatchingSelect';
import filterByOrg from '../../utils/filterByOrg';
import { retrieveCallAssignments, retrieveCallAssignmentsRecursive } from '../../actions/callAssignment';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';


@connect(state => ({ 
    callAssignments: state.callAssignments,
    orgList: flattenOrganizationsFromState(state),
}))
@injectIntl
export default class CallerFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState(stateFromConfig(nextProps.config));
        }
    }

    componentDidMount() {
        super.componentDidMount();

        let assignmentList = this.props.callAssignments.assignmentList;

        if ((assignmentList.items.length == 0 || !this.props.callAssignments.assignmentList.recursive) && !assignmentList.isPending) {
            this.props.dispatch(retrieveCallAssignmentsRecursive());
        }
    }

    renderFilterForm(config) {
        let assignmentStore = this.props.callAssignments;
        let assignments = assignmentStore.assignmentList.items;
        assignments = filterByOrg(this.props.orgList, assignments, this.state).map(i => i.data);

        const msg = id => this.props.intl.formatMessage({ id });

        const OPERATOR_OPTIONS = {
            'assigned': msg('filters.caller.operators.assigned'),
            'notassigned': msg('filters.caller.operators.notassigned'),
            'num_calls': msg('filters.caller.operators.numCalls'),
            'most_active': msg('filters.caller.operators.mostActive'),
        };

        let matchingSelect = null;
        if (this.state.operator == 'num_calls') {
            matchingSelect = (
                <FilterMatchingSelect
                    config={ this.props.config.matching }
                    labelMsgStem='filters.caller.matching'
                    onChange={ this.onChangeMatching.bind(this) } />
            );
        }

        let numCallersInput = null;
        if (this.state.operator == 'most_active') {
            numCallersInput = (
                <div className="CallerFilter-num_callers">
                    <Msg tagName="label" id={ "filters.caller.numCallers" } />
                    <IntInput key="num_callers" name="num_callers" value={ this.state.num_callers }
                        onValueChange={ this.onChangeNumCallers.bind(this) }/>
                </div>
            )
        }

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,

            <SelectInput key="operator" name="operator"
                labelMsg="filters.caller.operator"
                options={ OPERATOR_OPTIONS } value={ this.state.operator }
                onValueChange={ this.onSelectOperator.bind(this) }
                />,

            matchingSelect,
            numCallersInput,

            <RelSelectInput key="assignment" name="assignment"
                labelMsg="filters.caller.assignment"
                objects={ assignments } value={ this.state.assignment }
                onValueChange={ this.onChangeAssignment.bind(this) }
                showCreateOption={ false }
                allowNull={ true }
                nullLabel={ msg("filters.caller.anyAssignment") }
                />,
        ];
    }

    onChangeMatching(matching) {
        this.setState({
            matching: matching,
        }, () => this.onConfigChange());
    }

    onChangeAssignment(name, value) {
        this.setState({ assignment: value }, () => this.onConfigChange());
    }

    onChangeNumCallers(name, value) {
        value = parseInt(value);
        this.setState({ num_callers: value }, () =>
            this.onConfigChange());
    }

    onSelectOperator(name, value) {
        let state = {
            operator: value,
            matching: undefined,
            num_callers: undefined,
        };

        if (value == 'num_calls') {
            state['matching'] = this.state.matching || {
                min: 1,
            };
        } else if (value == 'most_active') {
            state['num_callers'] = this.state.num_callers || 10;
        }
        this.setState(state, () => this.onConfigChange());
    }

    onSelectAssignment(name, value) {
        const assignment = this.state.assignment;
        if (value == 'any') {
            this.setState({ assignment: null }, () =>
                this.onConfigChange());
        }
        else {
            this.setState({ assignemnt: value }, () =>
                this.onConfigChange());
        }
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () =>
            this.onConfigChange());
    }

    getConfig() {
        return {
            operator: this.state.operator,
            assignment: this.state.assignment,
            matching: this.state.matching,
            num_callers: this.state.num_callers,
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };
    }
}

function stateFromConfig(config) {
    let num_callers;
    let matching;
    if (config.operator == 'most_active') {
        num_callers = config.num_callers;
    } else if (config.operator == 'num_calls') {
        matching = config.matching;
    }

    const state = {
            operator: config.operator,
            assignment: config.assignment,
            matching: matching,
            num_callers: num_callers,
            organizationOption: config.organizationOption || 'current',
            specificOrganizations: config.specificOrganizations || [],
        };

    return state;
}
