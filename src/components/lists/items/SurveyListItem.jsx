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

        if (survey.access === "open") {
            access = <Msg id="lists.surveyList.item.access.open"/>;
        }
        else if (survey.access === "auth") {
            access = <Msg id="lists.surveyList.item.access.auth"/>;
        }

        let accessClassNames  = cx('SurveyListItem-access', survey.access );

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
                    <span className={ accessClassNames }>
                        { access }
                    </span>
                    { callers_only }
                </div>
            </div>
        );
    }
}

