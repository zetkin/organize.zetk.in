import React from 'react';
import truncText from '../../../../utils/truncText';

export default function PersonNotesCell(props) {
    let notes;
    if (props.content && props.content.length) {
        const lines = props.content.filter(line => !!line.text && !!line.text.length);
        notes = lines.map(n => (
            <div key={ n.id }
                className="PersonNotesCell-note"
                onClick={ () => props.openPane('notes', 'person', n.person_id) } >
                { truncText(n.text.replace(/<[^>]*>/g, '')) }
            </div>
        ));

    }
    return (
        <td className={`PersonNotesCell ${props.column.type}`}>
            { notes }
        </td>
    );
}
