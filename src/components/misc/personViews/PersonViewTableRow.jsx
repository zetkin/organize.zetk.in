import React from 'react';

import Avatar from '../Avatar';


export default function PersonViewTableRow(props) {
    const rowData = props.rowData;
    const cells = rowData.content.map((cellData, index) => (
        <td key={ index }>{ JSON.stringify(cellData) }</td>
    ));

    return (
        <tr className="PersonViewTableRow">
            <td>
                <Avatar
                    person={{ id: rowData.id }}
                    onClick={ () => props.openPane('person', rowData.id ) }
                    />
            </td>
            { cells }
        </tr>
    );
}
