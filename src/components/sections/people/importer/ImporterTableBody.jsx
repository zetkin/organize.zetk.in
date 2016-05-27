import React from 'react';

import ImporterTableRow from './ImporterTableRow';


export default class ImporterTableBody extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
    };

    render() {
        let table = this.props.table;

        return (
            <tbody className="ImporterTableBody">
            { table.rows.map((row, index) => (
                <ImporterTableRow key={ index }
                    values={ row.values }
                    columns={ table.columns }/>
            )) }
            </tbody>
        );
    }
}
