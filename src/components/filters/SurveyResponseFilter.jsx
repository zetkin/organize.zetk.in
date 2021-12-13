import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import Form from '../forms/Form';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';
import filterByOrg from '../../utils/filterByOrg';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';
import { retrieveSurveysRecursive } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
    orgList: flattenOrganizationsFromState(state),
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

        if ((surveyList.items.length == 0 || !surveyList.recursive) && !surveyList.isPending) {
            this.props.dispatch(retrieveSurveysRecursive());
        }
    }

    renderFilterForm(config) {
        let surveys = this.props.surveyList.items || [];
        surveys = filterByOrg(this.props.orgList, surveys, this.state).map(i => i.data);

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
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

        config.organizationOption = this.state.organizationOption;
        config.specificOrganizations = this.state.specificOrganizations;

        return config;
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let state = {
        operator: config.operator || 'in',
        question: config.question,
        survey: config.survey,
        value: config.value,
        organizationOption: config.organizationOption || 'all',
        specificOrganizations: config.specificOrganizations || [],
    };

    return state;
}
