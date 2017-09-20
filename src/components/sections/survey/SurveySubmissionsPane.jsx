import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import SurveySubmissionList from '../../lists/SurveySubmissionList';
import SelectInput from '../../forms/inputs/SelectInput';
import { retrieveSurveys } from '../../../actions/survey';
import { retrieveSurveySubmissions } from '../../../actions/surveySubmission';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
    submissionList: state.surveySubmissions.submissionList,
});


@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionsPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveSurveySubmissions());
        this.props.dispatch(retrieveSurveys());
    }

    getPaneFilters(data, filters) {
        let surveyOptions = {
            '_': this.props.intl.formatMessage({
                id: 'panes.surveySubmissions.filters.survey.nullOption' }),
        };

        if (this.props.surveyList && this.props.surveyList.items) {
            this.props.surveyList.items.forEach(item => {
                surveyOptions[item.data.id] = item.data.title;
            });
        }

        return [
            <div key="survey">
                <Msg tagName="label" id="panes.surveySubmissions.filters.survey.label"/>
                <SelectInput name="survey" options={ surveyOptions }
                    value={ filters.survey || '_' }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
            </div>
        ];
    }

    renderPaneContent(data) {
        return (
            <SurveySubmissionList
                submissionList={ this.props.submissionList }
                onItemClick={ this.onItemClick.bind(this) }
                />
        );
    }

    onItemClick(item, ev) {
        let sub = item.data;
        this.openPane('surveysubmission', sub.id);
    }

    onFiltersApply(filters) {
        this.setState({ filters });

        if (filters.survey) {
            this.props.dispatch(retrieveSurveySubmissions(filters.survey));
        }
        else {
            this.props.dispatch(retrieveSurveySubmissions());
        }
    }
}
