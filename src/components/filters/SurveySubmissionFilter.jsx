import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import FilterTimeFrameSelect from './FilterTimeFrameSelect';
import Form from '../forms/Form';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import filterByOrg from '../../utils/filterByOrg';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';
import { retrieveSurveysRecursive } from '../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
    orgList: flattenOrganizationsFromState(state),
});

@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionFilter extends FilterBase {
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

        let surveyList = this.props.surveyList;

        if (surveyList.items && (surveyList.items.length == 0 || !surveyList.recursive) && !surveyList.isPending) {
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
                labelMsg="filters.surveySubmission.survey"
                objects={ surveys } value={ this.state.survey }
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <FilterTimeFrameSelect key="timeframe"
                config={ this.state }
                future={ false }
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
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
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

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let state = {
        operator: 'submitted',
        survey: config.survey,
        after: config.after,
        before: config.before,
        organizationOption: config.organizationOption || 'all',
        specificOrganizations: config.specificOrganizations || [],
    };

    return state;
}
