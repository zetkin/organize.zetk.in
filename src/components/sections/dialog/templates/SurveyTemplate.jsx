import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function SurveyTemplate(props) {
    return (
        <AssignmentTemplate type="survey"
            title="Survey" image=""
            onCreate={ props.onCreate }>
            Call to ask members to answer a survey (once supported).
        </AssignmentTemplate>
    );
}
