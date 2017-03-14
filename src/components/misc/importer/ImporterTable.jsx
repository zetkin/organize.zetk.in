import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import ImporterTableHead from './ImporterTableHead';
import ImporterTableBody from './ImporterTableBody';
import {
    updateImportColumn,
    useImportTableFirstRowAsHeader,
} from '../../../actions/importer';


export default class ImporterTable extends React.Component {
    static propTypes = {
        table: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        maxRows: React.PropTypes.number.isRequired,
        onEditColumn: React.PropTypes.func,
    };

    render() {
        let table = this.props.table;

        let removedInfo = null;
        if (table.numEmptyColumnsRemoved > 0) {
            let removedLabel = 'Empty columns removed: '
                + table.numEmptyColumnsRemoved;

            removedInfo = (
                <div className="ImporterTable-info">
                    <Msg tagName="p" id="panes.import.table.emptyColumnsRemoved"
                        values={{ numRemoved: table.numEmptyColumnsRemoved }}/>
                </div>
            );
        }

        return (
            <div className="ImporterTable">
                <h1>{ table.name }</h1>

                { removedInfo }

                <div className="ImporterTable-settings">
                    <input type="checkbox" checked={ table.useFirstRowAsHeader }
                        onChange={ this.onChangeFirstRow.bind(this) }/>
                    <Msg id="panes.import.table.firstRowAsHeader"/>
                </div>

                <table>
                    <ImporterTableHead columnList={ table.columnList }
                        onChangeColumn={ this.onChangeColumn.bind(this) }
                        onEditColumn={ this.onEditColumn.bind(this) }/>
                    <ImporterTableBody table={ table }
                        maxRows={ this.props.maxRows }
                        />
                </table>
            </div>
        );
    }

    onChangeColumn(columnId, props) {
        let tableId = this.props.table.id;
        this.props.dispatch(
            updateImportColumn(tableId, columnId, props));
    }

    onEditColumn(column) {
        // TODO: After pane refactor, dispatch open action here
        if (this.props.onEditColumn) {
            this.props.onEditColumn(this.props.table, column);
        }
    }

    onChangeFirstRow(ev) {
        let tableId = this.props.table.id;
        let val = !this.props.table.useFirstRowAsHeader;
        this.props.dispatch(useImportTableFirstRowAsHeader(tableId, val));
    }
}
