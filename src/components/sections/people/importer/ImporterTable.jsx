import React from 'react';

import ImporterTableHead from './ImporterTableHead';
import ImporterTableBody from './ImporterTableBody';
import { useImportTableFirstRowAsHeader } from '../../../../actions/peopleImport';


export default class ImporterTable extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    };

    render() {
        let table = this.props.table;

        return (
            <div className="ImporterTable">
                <h1>{ table.name }</h1>
                Use first row as header:
                <input type="checkbox" checked={ table.useFirstRowAsHeader }
                    onChange={ this.onChangeFirstRow.bind(this) }/>
                <table>
                    <ImporterTableHead columns={ table.columns }/>
                    <ImporterTableBody table={ table }/>
                </table>
            </div>
        );
    }

    onChangeFirstRow(ev) {
        let tableId = this.props.table.id;
        let val = !this.props.table.useFirstRowAsHeader;
        this.props.dispatch(useImportTableFirstRowAsHeader(tableId, val));
    }
}
