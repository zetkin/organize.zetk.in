import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

export default function GenderViewCell(props) {
    return (
        <td className={`GenderViewCell ${props.column.type}`}>
            <Msg id={`misc.personViewTable.cells.gender.${props.content}`} />
        </td>
    );
}
