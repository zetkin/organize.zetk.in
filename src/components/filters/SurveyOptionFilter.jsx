import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';
import { retrieveSurveys, retrieveSurvey } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
    elementsBySurvey: state.surveys.elementsBySurvey,
});

@connect(mapStateToProps)
@injectIntl
export default class SurveyOptionFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromConfig(nextProps.config));

        if (nextProps.config.survey && nextProps.config.survey != this.props.config.survey) {
            this.props.dispatch(retrieveSurvey(this.state.survey));
        }
    }

    componentDidMount() {
        super.componentDidMount();

        let surveyList = this.props.surveyList;

        if (surveyList.items.length == 0 && !surveyList.isPending) {
            this.props.dispatch(retrieveSurveys());
        }

        if (this.state.survey) {
            this.props.dispatch(retrieveSurvey(this.state.survey));
        }
    }

    renderFilterForm(config) {
        let surveys = this.props.surveyList.items.map(i => i.data);
        let questionSelect;
        let optionSelect;

        if (this.state.survey) {
            let elements = this.props.elementsBySurvey[this.state.survey.toString()];
            let questions = {};
            let question;

            if (elements && elements.items) {
                elements.items
                    .map(i => i.data)
                    .filter(e => e.type === 'question')
                    .map(e => Object.assign({}, e.question, { id: e.id }))
                    .filter(q => q.response_type === 'options')
                    .forEach(q => {
                        questions[q.id] = q.question;

                        if (this.state.question === q.id.toString()) {
                            question = q;
                        }
                    });

                questionSelect = (
                    <SelectInput name="question" key="question"
                        labelMsg="filters.surveyOption.question"
                        options={ questions } value={ this.state.question }
                        onValueChange={ this.onChangeSimpleField.bind(this) }
                        />
                );
            }

            if (question) {
                let options = {};

                question.options.forEach(option => {
                    options[option.id] = option.text;
                });

                optionSelect = (
                    <SelectInput name="option" key="option"
                        labelMsg="filters.surveyOption.option"
                        options={ options } value={ this.state.option }
                        onValueChange={ this.onChangeSimpleField.bind(this) }
                        />
                );
            }
        }

        return [
            <RelSelectInput name="survey" key="surveySelect"
                labelMsg="filters.surveyOption.survey"
                objects={ surveys } value={ this.state.survey }
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,
            questionSelect,
            optionSelect,
        ];
    }

    getConfig() {
        let config = {
            operator: this.state.operator,
            question: this.state.question,
            survey: this.state.survey,
            options: this.state.option? [ this.state.option ] : undefined,
        };

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
        operator: config.operator || 'any',
        question: config.question,
        survey: config.survey,
        option: (config.options && config.options.length)?
            config.options[0] : undefined,
    };

    return state;
}
