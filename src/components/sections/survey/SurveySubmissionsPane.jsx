import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import SurveySubmissionList from '../../lists/SurveySubmissionList';
import { retrieveSurveySubmissions } from '../../../actions/surveySubmission';


const mapStateToProps = state => ({
    submissionList: state.surveySubmissions.submissionList,
});


@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionsPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveSurveySubmissions())
    }

    renderPaneContent(data) {
        return (
            <SurveySubmissionList
                submissionList={ this.props.submissionList }
                />
        );
    }
}
