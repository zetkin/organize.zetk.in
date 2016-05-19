import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function SurveyTemplate(props) {
    return (
        <AssignmentTemplate type="survey"
            title="Survey" onCreate={ props.onCreate }>
            Call members to collect responses to a survey (once supported).
        </AssignmentTemplate>
    );
}
