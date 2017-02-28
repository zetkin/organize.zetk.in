import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import MatchBase from './MatchBase';


export default class SurveySubmissionMatch extends MatchBase {
    getTitle() {

        let values = {
            survey: this.props.data.survey.title,
            respondent: this.props.data.respondent.first_name
                + ' ' + this.props.data.respondent.last_name,
        };

        return (
            <Msg id="header.search.matches.surveySubmission"
                values={ values }/>
        );
    }

    getImage() {
        // TODO: Use some sort of phone icon?
        return null;
    }
}
