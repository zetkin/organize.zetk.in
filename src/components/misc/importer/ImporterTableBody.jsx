import React from 'react';

import ImporterTableRow from './ImporterTableRow';


export default class ImporterTableBody extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
        maxRows: React.PropTypes.number.isRequired,
    };

    render() {
        let table = this.props.table;
        let columns = table.columnList.items.map(i => i.data);
        let rows = table.rows.slice(0, this.props.maxRows);

        return (
            <table className="ImporterTableBody">
                <tbody>
                { rows.map((row, index) => (
                    <ImporterTableRow key={ index }
                        values={ row.values }
                        columns={ columns }/>
                )) }
                </tbody>
            </table>
        );
    }
}
