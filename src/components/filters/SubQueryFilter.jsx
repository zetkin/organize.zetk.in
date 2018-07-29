import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import SelectInput from '../forms/inputs/SelectInput';

import { retrieveCallAssignments } from '../../actions/callAssignment';
import { retrieveQueries } from '../../actions/query';

const mapStateToProps = state => {
    const assignmentList = state.callAssignments.assignmentList;
    const queryList = state.queries.queryList;

    return {
        assignmentList,
        queryList,
    };
};


@injectIntl
@connect(mapStateToProps)
export default class SubQueryFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            queryId: props.config.query_id,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveCallAssignments());
        this.props.dispatch(retrieveQueries());
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                queryId: nextProps.config.query_id,
            });
        }
    }

    renderFilterForm(config) {
        const SA_OPTIONS = {}
        const queryItems = this.props.queryList.items || [];
        queryItems
            .filter(item => item.data.type == 'standalone')
            .forEach(item => {
                const query = item.data;
                SA_OPTIONS[query.id] = query.title;
            });

        const CA_OPTIONS = {}
        const assignmentItems = this.props.assignmentList.items || [];
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
        };
    }

    onQuerySelect(name, value) {
        this.setState({ queryId: value }, () => this.onConfigChange());
    }
}
