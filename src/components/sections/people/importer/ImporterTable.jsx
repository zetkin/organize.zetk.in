import React from 'react';

import ImporterTableHead from './ImporterTableHead';
import ImporterTableBody from './ImporterTableBody';


export default class ImporterTable extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
    };

    render() {
        let table = this.props.table;

        return (
            <div className="ImporterTable">
                <h1>{ table.name }</h1>
                <table>
                    <ImporterTableHead columns={ table.columns }/>
                    <ImporterTableBody table={ table }/>
                </table>
            </div>
        );
    }
}
