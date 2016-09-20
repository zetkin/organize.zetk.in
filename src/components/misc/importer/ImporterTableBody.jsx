import React from 'react';

import ImporterTableRow from './ImporterTableRow';


export default class ImporterTableBody extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
    };

    render() {
        let table = this.props.table;
        let rows = table.rows;
        let columns = table.columnList.items.map(i => i.data);

        return (
            <tbody className="ImporterTableBody">
            { rows.map((row, index) => (
                <ImporterTableRow key={ index }
                    values={ row.values }
                    columns={ columns }/>
            )) }
            </tbody>
        );
    }
}
