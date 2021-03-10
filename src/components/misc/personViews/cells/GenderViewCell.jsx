import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

export default function GenderViewCell(props) {
    const genderOptions = {
        'f': 'female',
        'm': 'male',
        'o': 'other'
    }
    const gender = genderOptions[props.content] || 'unknown';

    return (
        <td className={`GenderViewCell ${props.column.type}`}>
            <Msg id={`misc.personViewTable.cells.gender.${gender}`} />
        </td>
    );
}
