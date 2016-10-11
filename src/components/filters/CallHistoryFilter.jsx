import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import DateInput from '../forms/inputs/DateInput';
import IntInput from '../forms/inputs/IntInput';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { retrieveCallAssignments } from '../../actions/callAssignment';


@connect(state => ({ callAssignments: state.callAssignments }))
@injectIntl
export default class CallHistoryFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromConfig(nextProps.config));
    }

    componentDidMount() {
        let assignmentList = this.props.callAssignments.assignmentList;

        if (assignmentList.items.length == 0 && !assignmentList.isPending) {
            this.props.dispatch(retrieveCallAssignments());
        }
    }

    renderFilterForm(config) {
        let assignmentStore = this.props.callAssignments;
        let assignments = assignmentStore.assignmentList.items.map(i => i.data);
        let timeframe = this.state.timeframe;
        let op = this.state.op;

        const msg = id => this.props.intl.formatMessage({ id });

        const OPERATOR_OPTIONS = {
            'called_spec': msg('filters.callHistory.opOptions.calledSpec'),
            'called_any': msg('filters.callHistory.opOptions.calledAny'),
            'reached_spec': msg('filters.callHistory.opOptions.reachedSpec'),
            'reached_any': msg('filters.callHistory.opOptions.reachedAny'),
            'notreached_spec': msg('filters.callHistory.opOptions.notReachedSpec'),
            'notreached_any': msg('filters.callHistory.opOptions.notReachedAny'),
        };

        const DATE_OPTIONS = {
            'any': msg('filters.callHistory.dateOptions.any'),
            'after': msg('filters.callHistory.dateOptions.after'),
            'before': msg('filters.callHistory.dateOptions.before'),
            'between': msg('filters.callHistory.dateOptions.between'),
            'inlast': msg('filters.callHistory.dateOptions.inLast'),
        };

        let assignmentSelect = null;
        if (op.indexOf('spec') > 0) {
            assignmentSelect = (
                <RelSelectInput name="assignment"
                    labelMsg="filters.callHistory.assignment"
                    objects={ assignments } value={ this.state.assignment }
                    onValueChange={ this.onChangeSimpleField.bind(this) }
                    showCreateOption={ false }/>
            );
        }

        let afterInput = null;
        if (timeframe == 'after' || timeframe == 'between') {
            afterInput = (
                <DateInput key="after" name="after"
                    className="CallHistoryFilter-after"
                    value={ this.state.after }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        let beforeInput = null;
        if (timeframe == 'before' || timeframe == 'between') {
            beforeInput = (
                <DateInput key="before" name="before"
                    className="CallHistoryFilter-before"
                    value={ this.state.before }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        let daysInput = null;
        if (timeframe == 'inlast') {
            daysInput = [
                <IntInput key="days" name="days" value={ this.state.days }
                    className="CallHistoryFilter-days"
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>,
                <label key="daysLabel"
                    className="CallHistoryFilter-daysLabel">days</label>,
            ];
        }

        return [
            <SelectInput key="operator" name="operator"
                label="Match people who have been"
                options={ OPERATOR_OPTIONS } value={ this.state.op }
                onValueChange={ this.onSelectOperator.bind(this) }/>,

            assignmentSelect,

            <SelectInput key="timeframe" name="timeframe"
                options={ DATE_OPTIONS } value={ this.state.timeframe }
                onValueChange={ this.onSelectTimeframe.bind(this) }/>,

            afterInput,
            beforeInput,
            daysInput,
        ];
    }

    getConfig() {
        let opFields = this.state.op.split('_');
        let before = this.state.before;
        let after = this.state.after;

        if (this.state.timeframe == 'inlast') {
            after = '-' + this.state.days + 'd';
        }

        return {
            operator: opFields[0],
            assignment: (opFields[1] == 'spec')? this.state.assignment : null,
            before: before,
            after: after,
        };
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }

    onSelectOperator(name, value) {
        if (value.indexOf('any') > 0) {
            this.setState({ op: value, campaign: null }, () =>
                this.onConfigChange());
        }
        else {
            // Don't fire event for "spec" operators until a campaign
            // has actually been selected.
            this.setState({ op: value });
        }
    }

    onSelectTimeframe(name, value) {
        let before = undefined;
        let after = undefined;
        let days = undefined;
        let today = Date.utc.create().format('{yyyy}-{MM}-{dd}');

        switch (value) {
            case 'after':
                after = today;
                break;
            case 'before':
                before = today;
                break;
            case 'inlast':
                days = 30;
                break;
            case 'between':
                after = today;
                before = (30).daysAfter(today).format('{yyyy}-{MM}-{dd}');
                break;
        }

        this.setState({ timeframe: value, before, after, days }, () =>
            this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let opPrefix = config.operator || 'reached';
    let opSuffix = config.assignment? 'spec' : 'any';

    let state = {
        op: opPrefix + '_' + opSuffix,
        assignment: config.assignment,
        before: config.before,
        after: config.after,
    }

    state.timeframe = 'any';
    if (config.before && config.after) {
        state.timeframe = 'between';
    }
    else if (config.before) {
        state.timeframe = 'before';
    }
    else if (config.after) {
        let match = /-([0-9]*)d/.exec(config.after);
        if (match) {
            state.timeframe = 'inlast';
            state.days = match[1];
        }
        else {
            state.timeframe = 'after';
        }
    }

    return state;
}
