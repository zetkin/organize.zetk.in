import React from 'react';
import { FormattedRelative, injectIntl } from 'react-intl';


export default injectIntl(function SurveySubmittedCell(props) {
    let formattedDate = null;

    if (props.content && props.content.length) {
        const sorted = props.content.map(sub => ({
                ...sub,
                submitted: new Date(sub.submitted)
            }))
            .sort((d0, d1) => d1 - d0);

        if (sorted.length) {
            const mostRecent = sorted[0];
            const longForm = props.intl.formatDate(mostRecent.submitted, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            });

            formattedDate = (
                <a onClick={ () => props.openPane('surveysubmission', mostRecent.submission_id) }
                    title={ longForm }
                    >
                    <FormattedRelative value={mostRecent.submitted}/>
                </a>
            );
        }
    }

    return (
        <td className={`SurveySubmittedCell ${props.column.type}`}>
            { formattedDate }
        </td>
    );
});
