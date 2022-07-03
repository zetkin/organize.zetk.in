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
        let status = null;

        if (survey.access === "open") {
            access = <Msg id="lists.surveyList.item.access.open"/>;
        }
        else if (survey.access === "auth") {
            access = <Msg id="lists.surveyList.item.access.auth"/>;
        }

        let accessClassNames  = cx('SurveyListItem-access', survey.access );

        let signature = <Msg id={ `lists.surveyList.item.signature.${survey.signature}` } />

        let statusMsgId;
        let statusName;
        if (survey.published) {
            if (new Date(survey.published) > new Date()) {
                statusName = 'draft';
                statusMsgId = 'lists.surveyList.item.status.draftUntil';
            } else {
                if (survey.expires) {
                    if (new Date(survey.expires) > new Date()) {
                        statusName = 'active';
                        statusMsgId = 'lists.surveyList.item.status.activeUntil';
                    } else {
                        statusName = 'archived';
                        statusMsgId = 'lists.surveyList.item.status.archived';
                    }
                } else {
                    statusName = 'active';
                    statusMsgId = 'lists.surveyList.item.status.active';
                }
            }
        } else {
            statusName = 'draft';
            statusMsgId = 'lists.surveyList.item.status.draft';
        }

        status = (
            <span className={ `SurveyListItem-status-${statusName}` }>
                <Msg id={ statusMsgId } values={ {
                    expires: (new Date(survey.expires)).format('{yyyy}-{MM}-{dd}'),
                    published: (new Date(survey.published)).format('{yyyy}-{MM}-{dd}'),
                } }  />
            </span>
        );

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
                    <span className={ `SurveyListItem-signature` }>
                        { signature }
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

