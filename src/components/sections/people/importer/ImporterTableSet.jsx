import React from 'react';

import ImporterTable from './ImporterTable';
import { getListItemById } from '../../../../utils/store';


export default class ImporterTableSet extends React.Component {
    static propTypes = {
        tableSet: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
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
                    dispatch={ this.props.dispatch }/>
            );
        }

        return (
            <div className="ImporterTableSet">
                <ul className="ImporterTableSet-tabs">
                { tableSet.tableList.items.map(item => (
                    <li key={ item.data.id } className="ImporterTableSet-tab"
                        onClick={ this.onClickTab.bind(this, item.data) }>
                        { item.data.name }
                    </li>
                )) }
                </ul>
                { table }
            </div>
        );
    }

    onClickTab(table) {
        this.setState({
            selectedTableId: table.id,
        });
    }
}
