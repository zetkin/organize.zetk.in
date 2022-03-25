import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import Form from '../forms/Form';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import SelectInput from '../forms/inputs/SelectInput';
import filterByOrg from '../../utils/filterByOrg';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';
import { retrieveSurveysRecursive, retrieveSurvey } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
    elementsBySurvey: state.surveys.elementsBySurvey,
    orgList: flattenOrganizationsFromState(state),
});

@connect(mapStateToProps)
@injectIntl
export default class SurveyOptionFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = this.stateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.stateFromProps(nextProps));

        if (nextProps.config.survey && nextProps.config.survey != this.props.config.survey) {
            this.props.dispatch(retrieveSurvey(this.state.survey));
        }
    }

    componentDidMount() {
        super.componentDidMount();

        let surveyList = this.props.surveyList;

        if (surveyList.items && (surveyList.items.length == 0 || !surveyList.items.recursive) && !surveyList.isPending) {
            this.props.dispatch(retrieveSurveysRecursive());
        }

        if (this.state.survey) {
            this.props.dispatch(retrieveSurvey(this.state.survey));
        }
    }

    renderFilterForm(config) {
        let surveys = this.props.surveyList.items || [];
        surveys = filterByOrg(this.props.orgList, surveys, this.state).map(i => i.data);

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

                        if (this.state.question && this.state.question.toString() === q.id.toString()) {
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
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
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
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };

        return config;
    }

    stateFromProps(props) {
        let autoChanged = false;
        let config = props.config;
        let state = {
            operator: config.operator || 'any',
            question: config.question,
            survey: config.survey,
            option: (config.options && config.options.length)?
                config.options[0] : undefined,
            organizationOption: config.organizationOption || 'all',
            specificOrganizations: config.specificOrganizations || [],
        };

        if (state.survey && (!state.question || !state.option)) {
            let elementList = props.elementsBySurvey[state.survey.toString()];

            if (elementList && elementList.items) {
                if (!state.question) {
                    // Select first question by default
                    let firstQuestionElement = elementList.items.find(i =>
                        (i.data.type == 'question' && i.data.question.response_type == 'options'));

                    if (firstQuestionElement) {
                        state.question = firstQuestionElement.data.id;
                        autoChanged = true;
                    }
                }

                if (state.question && !state.option) {
                    let questionElement = elementList.items.find(i =>
                        (i.data.id.toString() == state.question.toString()));

                    if (questionElement && questionElement.data) {
                        let options = questionElement.data.question.options;
                        if (options && options.length) {
                            state.option = options[0].id;
                            autoChanged = true;
                        }
                    }
                }
            }
        }
        
        if (autoChanged) {
            this.onConfigChange();
        }

        return state;
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
    
        if (name === 'question' && this.state.question != value ) {
            const elementList = this.props.elementsBySurvey[this.state.survey.toString()];
            let questionElement = elementList.items.find(i =>
                (i.data.id.toString() == value));

            if (questionElement && questionElement.data) {
                let options = questionElement.data.question.options;
                if (options && options.length) {
                    state.option = options[0].id;
                }
            }
        }

        this.setState(state, () => this.onConfigChange());
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}
