import React from 'react';


export default function SurveyResponseCell(props) {
    let responses = null;
    if (props.content && props.content.length) {
        responses = props.content.map(response => (
            <div key={ response.submission_id }
                className="SurveyResponseCell-response"
                onClick={ () => props.openPane('surveysubmission', response.submission_id) }>
                { response.text }
            </div>
        ));
    }
    return (
        <td className={`SurveyResponseCell ${props.column.type}`}>
            { responses }
        </td>
    );
}
