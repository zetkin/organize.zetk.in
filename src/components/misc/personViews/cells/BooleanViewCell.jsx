import cx from 'classnames';
import React from 'react';


export default function PlainTextViewCell(props) {
    // TODO: Add interactivity
    const classes = cx('BooleanViewCell', {
        'true': props.content,
        'false': !props.content,
    });

    return (
        <td className={ classes }>
            <input type="checkbox" checked={ props.content } disabled={ true }/>
        </td>
    );
}
