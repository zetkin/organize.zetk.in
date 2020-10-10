import React from 'react';


export default function PlainTextViewCell(props) {
    return (
        <td className={`PlainTextViewCell ${props.column.type}`}>
            { props.content }
        </td>
    );
}
