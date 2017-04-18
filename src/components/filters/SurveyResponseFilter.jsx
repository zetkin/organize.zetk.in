import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';
import { retrieveSurveys } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
});

@connect(mapStateToProps)
@injectIntl
export default class SurveyResponseFilter extends FilterBase {
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
                labelMsg="filters.surveyResponse.survey"
                objects={ surveys } value={ this.state.survey }
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,
            <TextInput name="value" key="value"
                className="SurveyResponseFilter-valueInput"
                value={ this.state.value }
                labelMsg="filters.surveyResponse.value"
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,
        ];
    }

    getConfig() {
        let config = {
            operator: this.state.operator,
            value: this.state.value,
        };

        if (this.state.question) {
            config.question = this.state.question;
        }
        else {
            config.survey = this.state.survey;
        }

        return config;
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let state = {
        operator: config.operator || 'in',
        question: config.question,
        survey: config.survey,
        value: config.value,
    };

    return state;
}
