import React from 'react';
import cx from 'classnames';

import DraggableAvatar from '../../misc/DraggableAvatar';
import { FormattedMessage as Msg } from 'react-intl';


export default class SurveyListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    render() {
        let survey = this.props.data;
        let access = null;
        let callers_only = null;
        let allow_anonymous = null;
        let status = null;

        if (survey.access === "open") {
            access = <Msg id="lists.surveyList.item.access.open"/>;
        }
        else if (survey.access === "auth") {
            access = <Msg id="lists.surveyList.item.access.auth"/>;
        }

        let accessClassNames  = cx('SurveyListItem-access', survey.access );

        if (survey.allow_anonymous) {
            allow_anonymous = <Msg id="lists.surveyList.item.anonymous.allow"/>;
        }
        else {
            allow_anonymous = <Msg id="lists.surveyList.item.anonymous.deny"/>;
        }

        if (!survey.archived) {
            status = (
                <span className="SurveyListItem-status-active">
                    <Msg id="lists.surveyList.item.status.active"/>
                </span>
            )
        }
        else {
            status = (
                <span className="SurveyListItem-status-archived">
                    <Msg id="lists.surveyList.item.status.archived"/>
                </span>
            )
        }

        if (survey.callers_only) {
            callers_only = (
                <span className="SurveyListItem-callers">
                    <Msg id="lists.surveyList.item.callersOnly"/>
                </span>
            );
        }

        return (
            <div className="SurveyListItem"
                onClick={ this.props.onItemClick }>
                <div className="SurveyListItem-content">
                    <span className="SurveyListItem-title">
                        { survey.title }</span>
                    <span className="SurveyListItem-access">
                        { access }
                    </span>
                    <span className="SurveyListItem-anonymous">
                        { allow_anonymous }
                    </span>
                    <span className="SurveyListItem-status">
                        { status }
                    </span>
                    { callers_only }
                </div>
            </div>
        );
    }
}

