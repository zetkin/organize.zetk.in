import cx from 'classnames';
import React from 'react';


export default function BooleanViewCell(props) {
    // TODO: Add interactivity
    const classes = cx('BooleanViewCell', props.column.type, {
        'true': props.content,
        'false': !props.content,
        'interactive': props.interactive,
    });

    const onClick = () => {
        if (props.interactive) {
            props.onToggle(!props.content);
        }
    };

    return (
        <td className={ classes }
            onClick={ onClick }
            />
    );
}
