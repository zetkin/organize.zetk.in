import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../Button';
import ImporterTable from './ImporterTable';
import { getListItemById } from '../../../utils/store';
import { executeImport, resetImport } from '../../../actions/importer';


export default class ImporterTableSet extends React.Component {
    static propTypes = {
        tableSet: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        maxRows: React.PropTypes.number,
        onEditColumn: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        let tableSet = props.tableSet;
        this.state = {
            selectedTableId: (tableSet && tableSet.tableList.items.length == 1)?
                tableSet.tableList.items[0].data.id : null,
        };
    }

    render() {
        let tableSet = this.props.tableSet;

        if (this.state.selectedTableId == null) {
            return (
                <div className="ImporterTableSet">
                    <div className="ImporterTableSet-tableSelector">
                        <Msg tagName="h1" id="panes.import.tableSelect.h"/>
                        <Msg tagName="p" id="panes.import.tableSelect.p"/>
                        <select className="importerTableSet-tableSelect"
                            onChange={ this.onChangeTable.bind(this) }>
                            <Msg tagName="option"
                                id="panes.import.tableSelect.label"
                                values={
                                    { count: tableSet.tableList.items.length }
                                }/>
                        { tableSet.tableList.items.map(item => (
                            <option key={ item.data.id }
                                value={ item.data.id }>
                                { item.data.name }
                            </option>
                        )) }
                        </select>
                    </div>
                </div>
            );
        }

        let tableId = this.state.selectedTableId;
        let tableItem = getListItemById(tableSet.tableList, tableId);
        let maxRows = this.props.maxRows || 100;

        let table = (
            <ImporterTable table={ tableItem.data }
                maxRows={ maxRows }
                onEditColumn={ this.props.onEditColumn }
                dispatch={ this.props.dispatch }/>
        );

        let truncLabel;
        if (tableItem.data.rows.length > maxRows) {
            let values = {
                truncated: maxRows,
                total: tableItem.data.rows.length,
                extra: tableItem.data.rows.length - maxRows,
            };

            truncLabel = (
                <div className="ImporterTableSet-trunc">
                    <Msg id="panes.import.table.truncLabel"
                        values={ values }
                        />
                </div>
            );
        }

        return (
            <div className="ImporterTableSet">
                { table }
                { truncLabel }
                <Button
                    className="ImporterTableSet-abortButton"
                    labelMsg="panes.import.abortButton"
                    onClick={ this.onClickAbort.bind(this) }/>
                <Button
                    className="ImporterTableSet-importButton"
                    labelMsg="panes.import.importButton"
                    onClick={ this.onClickImport.bind(this) }/>
            </div>
        );
    }

    onChangeTable(ev) {
        this.setState({
            selectedTableId: ev.target.value,
        });
    }

    checkDuplicateTypes(columnList) {
        let typeCount = {};

        let items = columnList.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].data.type == "unknown") {
                continue;
            }
            // Create a reasonable key name
            let typeName = items[i].data.type + ', '+JSON.stringify(items[i].data.config);
            if (typeName in typeCount) {
                typeCount[typeName].push(i)
            } else {
                typeCount[typeName]= [i];
            }
        }

        // Pick out the types which have duplicates
        let duplicates = {};
        for (var typeName in typeCount) {
            if (typeCount[typeName].length > 1) {
                duplicates[typeName] = typeCount[typeName];
            }
        }

        return duplicates;
    }

    onClickImport() {
        let duplicates = this.checkDuplicateTypes(this.props.tableSet.tableList.items[0].data.columnList);

        if (Object.keys(duplicates).length > 0) {
            // TODO: Display in a better way
            let displayMessage = "You have duplicates: "+JSON.stringify(duplicates);
            alert(displayMessage);
            return ;
        }

        // TODO: Check that columns are chosen: first name, last name. alert box. break

        // TODO: Check column is chosen: external ID (recommended)
        // TODO: Check columns are good.

        // TODO: Dialod box - proceed - yes/no


        // If cool, continute
        this.props.dispatch(executeImport(this.state.selectedTableId));
    }

    onClickAbort() {
        this.props.dispatch(resetImport());
    }
}
