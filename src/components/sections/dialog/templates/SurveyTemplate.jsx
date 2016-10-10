import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function SurveyTemplate(props) {
    return (
        <AssignmentTemplate type="survey"
            onCreate={ props.onCreate }/>
    );
}
