import React from 'react';

import Avatar from '../Avatar';

import BooleanViewCell from './cells/BooleanViewCell';
import PlainTextViewCell from './cells/PlainTextViewCell';


export default function PersonViewTableRow(props) {
    const rowData = props.rowData;
    const columns = props.columnList.items.map(i => i.data);

    const cells = rowData.content.map((cellData, index) => {
        const col = columns[index];
        const cellProps = {
            key: index,
            content: cellData,
            column: col,
        };

        if (col.type == 'person_tag') {
            return <BooleanViewCell { ...cellProps }/>;
        }
        else {
            return <PlainTextViewCell { ...cellProps }/>;
        }
    });

    return (
        <tr className="PersonViewTableRow">
            <td className="PersonViewTableRow-avatar">
                <Avatar
                    person={{ id: rowData.id }}
                    onClick={ () => props.openPane('person', rowData.id ) }
                    />
            </td>
            { cells }
        </tr>
    );
}
