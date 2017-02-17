import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import {
    retrieveSurveySubmission,
} from '../../actions/surveySubmission';


const mapStateToProps = state => ({
    surveySubmissions: state.surveySubmissions,
});


@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionPane extends PaneBase {
    componentDidMount() {
        let subId = this.getParam(0);
        this.props.dispatch(retrieveSurveySubmission(subId));
    }

    getRenderData() {
        let subId = this.getParam(0);
        let subList = this.props.surveySubmissions.submissionList;

        return {
            submissionItem: getListItemById(subList, subId),
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        if (data.submissionItem && !data.submissionItem.isPending) {
            return formatMessage({ id: 'panes.surveySubmission.title' });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.submissionItem && !data.submissionItem.isPending) {
            let sub = data.submissionItem.data;
            let respondent = <Msg id="panes.surveySubmission.anonymous"/>;

            if (sub.respondent) {
                respondent = sub.respondent.first_name + ' ' + sub.respondent.last_name;
            }

            return [
                <div key="info" className="SurveySubmissionPane-info">
                    <ul>
                        <li>{ sub.survey.title }</li>
                        <li>{ respondent }</li>
                    </ul>
                </div>
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }
}
