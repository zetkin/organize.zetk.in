import React from 'react';

import DraggableAvatar from '../../misc/DraggableAvatar';


export default class SurveySubmissionListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    render() {
        let submission = this.props.data;

        let respondent = '';
        if (submission.respondent) {
            respondent = submission.respondent.first_name
                + ' ' + submission.respondent.last_name;
        }

        let surveyTitle = '';
        if (submission.survey) {
            surveyTitle = submission.survey.title;
        }

        return (
            <div className="SurveySubmissionListItem"
                onClick={ this.props.onItemClick }>
                <span className="SurveySubmissionListItem-survey">
                    { surveyTitle }</span>
                <span className="SurveySubmissionListItem-respondent">
                    { respondent }</span>
            </div>
        );
    }
}

