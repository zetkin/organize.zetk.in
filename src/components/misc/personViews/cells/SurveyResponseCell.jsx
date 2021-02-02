import React from 'react';
import truncText from '../../../../utils/truncText';

export default function SurveyResponseCell(props) {
    let responses = null;
    if (props.content && props.content.length) {
        const lines = props.content.filter(line => !!line.text && !!line.text.length);

        responses = lines.map(response => (
            <div key={ response.submission_id }
                className="SurveyResponseCell-response"
                onClick={ () => props.openPane('surveysubmission', response.submission_id) }>
                { truncText(response.text) }
            </div>
        ));
    }
    return (
        <td className={`SurveyResponseCell ${props.column.type}`}>
            { responses }
        </td>
    );
}
