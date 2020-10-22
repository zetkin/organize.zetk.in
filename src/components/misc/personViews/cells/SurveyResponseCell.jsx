import React from 'react';


const truncText = (s, maxLength=200) => {
    if (s.length < maxLength) {
        return s;
    }
    else {
        const words = s.split(' ');
        let out = '';

        for (let word of words) {
            if (out.length + word.length + 3 < maxLength) {
                out += ' ' + word;
            }
            else {
                return out + '...';
            }
        }
    }
};

export default function SurveyResponseCell(props) {
    let responses = null;
    if (props.content && props.content.length) {
        responses = props.content.map(response => (
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
