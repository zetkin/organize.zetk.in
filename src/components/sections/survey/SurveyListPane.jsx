import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import SurveyList from '../../lists/SurveyList';
import { retrieveSurveys } from '../../../actions/survey';


const mapStateToProps = state => ({
    surveyList: state.surveys.surveyList,
});


@connect(mapStateToProps)
@injectIntl
export default class SurveyListPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveSurveys())
    }

    renderPaneContent(data) {
        return (
            <SurveyList
                surveyList={ this.props.surveyList }
                onItemClick={ this.onItemClick.bind(this) }
                />
        );
    }

    onItemClick(item, ev) {
        let survey = item.data;
        this.openPane('survey', survey.id);
    }
}
