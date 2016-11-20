import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../Button';
import ImporterTable from './ImporterTable';
import { getListItemById } from '../../../utils/store';
import { executeImport } from '../../../actions/importer';


export default class ImporterTableSet extends React.Component {
    static propTypes = {
        tableSet: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        onEditColumn: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        let tableSet = props.tableSet;
        if (tableSet && tableSet.tableList.items.length > 0) {
            this.state = {
                selectedTableId: tableSet.tableList.items[0].data.id,
            };
        }
    }

    render() {
        let tableSet = this.props.tableSet;

        let table = null;
        if (this.state.selectedTableId) {
            let tableId = this.state.selectedTableId;
            let tableItem = getListItemById(tableSet.tableList, tableId);

            table = (
                <ImporterTable table={ tableItem.data }
                    onEditColumn={ this.props.onEditColumn }
                    dispatch={ this.props.dispatch }/>
            );
        }

        return (
            <div className="ImporterTableSet">
                <div className="importerTableSet-tableSelector">
                    <Msg id="panes.import.table.tableSelectLabel"
                        values={{ numRemoved: table.numEmptyColumnsRemoved }}/>
                    <select className="importerTableSet-tableSelect"
                        onChange={ this.onChangeTable.bind(this) }>
                    { tableSet.tableList.items.map(item => (
                        <option key={ item.data.id } value={ item.data.id }>
                            { item.data.name }
                        </option>
                    )) }
                    </select>
                </div>
                { table }
                <Button
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

    onClickImport() {
        this.props.dispatch(executeImport(this.state.selectedTableId));
    }
}
