import cx from 'classnames';
import React from 'react';


export default function BooleanViewCell(props) {
    // TODO: Add interactivity
    const classes = cx('BooleanViewCell', props.column.type, {
        'true': props.content,
        'false': !props.content,
    });

    return (
        <td className={ classes }>
            <input type="checkbox" checked={ props.content } disabled={ true }/>
        </td>
    );
}
