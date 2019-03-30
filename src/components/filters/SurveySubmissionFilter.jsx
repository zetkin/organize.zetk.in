import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterTimeFrameSelect from './FilterTimeFrameSelect';
import Form from '../forms/Form';
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

        return [
            <RelSelectInput name="survey" key="surveySelect"
                labelMsg="filters.surveySubmission.survey"
                objects={ surveys } value={ this.state.survey }
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <FilterTimeFrameSelect key="timeframe"
                config={ this.state }
                labelMsgStem="filters.surveySubmission.timeframe"
                onChange={ this.onSelectTimeframe.bind(this) }
                />
        ];
    }

    getConfig() {
        return {
            operator: 'submitted',
            survey: this.state.survey,
            after: this.state.after,
            before: this.state.before,
        };
    }

    onChangeSimpleField(name, value) {
        if (value) {
            let state = {};
            state[name] = value;
            this.setState(state, () => this.onConfigChange());
        }
    }

    onSelectTimeframe({ after, before }) {
        this.setState({ after, before }, () => this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let state = {
        operator: 'submitted',
        survey: config.survey,
        after: config.after,
        before: config.before,
    };

    return state;
}
