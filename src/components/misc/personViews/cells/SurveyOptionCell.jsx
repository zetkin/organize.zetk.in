import cx from 'classnames';
import React from 'react';

export default function SurveyOptionCell(props) {
    const checked = props.content.some((submission) => submission.selected);

    // Find the latest submission where selected is true, or failing that, the latest submission
    const latest = props.content.reduce((best_sub, submission) => {
        if (submission.submission_id > best_sub.submission_id && (submission.selected || !best_sub.selected)) {
            return submission;
        } 
        else {
            return best_sub
        }
    }, { submission_id: null });

    const classes = cx('BooleanViewCell', props.column.type, 'SurveyOptionCell', {
        'true': checked,
        'false': !checked,
        'survey': !!latest.submission_id,
    });

    return (
        <td className={ classes }
            onClick={ () => latest.submission_id ? props.openPane('surveysubmission', latest.submission_id) : null }>
        </td>
    );
}
