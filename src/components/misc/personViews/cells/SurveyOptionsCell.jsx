import React from 'react';
import truncText from '../../../../utils/truncText';

export default function SurveyOptionsCell(props) {
    let rendered_options = [];
    let hidden_options = [];
    let latest = null;
    if (props.content && props.content.length) {
        latest = props.content.reduce((latest, submission) => 
            !latest || 
                submission.submission_id >= latest.submission_id && 
                submission.selected.length ? submission : latest);
        const options = latest.selected.sort((a,b) => a.id > b.id);
        rendered_options = options.slice(0,2);
        hidden_options = options.slice(2);
    }
    return (
        <td className={`SurveyOptionsCell`}>
            <div className="SurveyOption-container"
                onClick={ () => latest ? props.openPane('surveysubmission', latest.submission_id) : null }>
                { rendered_options.map(o => (
                    <div className="SurveyOption-option"
                        key={ o.id }
                        title={ o.text }>
                        { o.text }
                    </div>
                )) }
                { hidden_options.length ? (
                    <div className="SurveyOption-more" 
                        title={
                            hidden_options.reduce((string, option) => string + option.text + '\n', '')
                        }>
                        +{ hidden_options.length }
                    </div>
                ) : null }
            </div>
        </td>
    );
}
