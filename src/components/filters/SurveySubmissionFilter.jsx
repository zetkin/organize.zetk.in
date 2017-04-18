import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import DateInput from '../forms/inputs/DateInput';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { retrieveSurveys } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
});

@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromConfig(nextProps.config));
    }

    componentDidMount() {
        super.componentDidMount();

        let surveyList = this.props.surveyList;

        if (surveyList.items.length == 0 && !surveyList.isPending) {
            this.props.dispatch(retrieveSurveys());
        }
    }

    renderFilterForm(config) {
        let surveys = this.props.surveyList.items.map(i => i.data);
        let timeframe = this.state.timeframe;

        const msg = id => this.props.intl.formatMessage({ id });

        const DATE_OPTIONS = {
            'any': msg('filters.surveySubmission.dateOptions.any'),
            'after': msg('filters.surveySubmission.dateOptions.after'),
        };

        let afterInput = null;
        if (timeframe == 'after') {
            afterInput = (
                <DateInput key="after" name="after"
                    className="SurveySubmissionFilter-after"
                    value={ this.state.after }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        return [
            <RelSelectInput name="survey" key="surveySelect"
                labelMsg="filters.surveySubmission.survey"
                objects={ surveys } value={ this.state.survey }
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <SelectInput key="timeframe" name="timeframe"
                options={ DATE_OPTIONS } value={ this.state.timeframe }
                onValueChange={ this.onSelectTimeframe.bind(this) }
                />,

            afterInput,
        ];
    }

    getConfig() {
        return {
            operator: 'submitted',
            survey: this.state.survey,
            after: this.state.after,
        };
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }

    onSelectTimeframe(name, value) {
        let after = undefined;

        if (value == 'after') {
            let today = Date.create();
            let todayStr = today.format('{yyyy}-{MM}-{dd}');

            after = todayStr;
        }

        this.setState({ timeframe: value, after }, () =>
            this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let state = {
        operator: 'submitted',
        survey: config.survey,
        timeframe: null,
        after: null,
    };

    if (config.after) {
        state.timeframe = 'after';
        state.after = Date(config.after);
    }

    return state;
}
