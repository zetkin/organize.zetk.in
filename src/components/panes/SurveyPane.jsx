import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Link from '../misc/Link';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey } from '../../actions/survey';


const mapStateToProps = (state, props) => ({
    surveyItem: getListItemById(state.surveys.surveyList,
        props.paneData.params[0]),
});


@connect(mapStateToProps)
@injectIntl
export default class SurveyPane extends PaneBase {
    getPaneTitle(data) {
        let surveyItem = this.props.surveyItem;
        if (surveyItem && surveyItem.data && !surveyItem.isPending) {
            return this.props.surveyItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        let surveyItem = this.props.surveyItem;
        if (surveyItem && !surveyItem.isPending) {
            let survey = surveyItem.data;
            let accessLabelMsg = 'panes.survey.summary.access.' + survey.access;
            let accessLabel = this.props.intl.formatMessage(
                { id: accessLabelMsg });

            return [
                <div key="summary"
                    className="SurveyPane-summary">
                    <span className="SurveyPane-summaryDesc">
                        { survey.info_text }</span>
                    <span className="SurveyPane-summaryAccess">
                        { accessLabel }</span>
                    <Link msgId="panes.survey.summary.editLink"
                        onClick={ this.onEditSummaryClick.bind(this) }/>
                </div>,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onEditSummaryClick(ev) {
        this.openPane('editsurvey', this.getParam(0));
    }
}
