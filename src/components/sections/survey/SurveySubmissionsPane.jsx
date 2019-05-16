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
        let surveyOptions = {}
        if (this.props.surveyList && this.props.surveyList.items) {
            this.props.surveyList.items.forEach(item => {
                surveyOptions[item.data.id] = item.data.title;
            });
        }

        return [
            <div key="survey">
                <Msg tagName="label" id="panes.surveySubmissions.filters.survey.label"/>
                <SelectInput name="survey" options={ surveyOptions }
                    value={ filters.survey }
                    nullOptionMsg="panes.surveySubmissions.filters.survey.nullOption"
                    orderAlphabetically={ true }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
                <Msg tagName="label" id="panes.surveySubmissions.filters.linked.label"/>
                <SelectInput name="linked"
                    value={ filters.linked }
                    nullOptionMsg="panes.surveySubmissions.filters.linked.nullOption"
                    options={{
                        'linked': 'panes.surveySubmissions.filters.linked.linked',
                        'unlinked': 'panes.surveySubmissions.filters.linked.unlinked',
                    }}
                    optionLabelsAreMessages={ true }
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
                enablePagination={ true }
                onLoadPage={ this.onLoadPage.bind(this) }
                />
        );
    }

    onLoadPage(page) {
        const {filters} = this.state;
        const survey = filters.survey ? filters.survey : null;

        this.props.dispatch(retrieveSurveySubmissions(survey, filters.linked, page));
    }

    onItemClick(item, ev) {
        let sub = item.data;
        this.openPane('surveysubmission', sub.id);
    }

    onFiltersApply(filters) {
        this.setState({ filters });

        if (filters.survey) {
            this.props.dispatch(retrieveSurveySubmissions(filters.survey, filters.linked));
        }
        else {
            this.props.dispatch(retrieveSurveySubmissions(null, filters.linked));
        }
    }
}
