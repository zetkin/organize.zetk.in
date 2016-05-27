import React from 'react';

import ImporterTable from './ImporterTable';


export default class ImporterTableSet extends React.Component {
    static propTypes = {
        tableSet: React.PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        let tableSet = props.tableSet;
        if (tableSet && tableSet.tables && tableSet.tables.length > 0) {
            this.state = {
                selectedTableId: tableSet.tables[0].id,
            };
        }
    }

    render() {
        let tableSet = this.props.tableSet;

        let table = null;
        if (this.state.selectedTableId) {
            let tableData = tableSet.tables.find(table =>
                table.id == this.state.selectedTableId);

            table = (
                <ImporterTable key={ tableData.id } table={ tableData }/>
            );
        }

        return (
            <div className="ImporterTableSet">
                <ul className="ImporterTableSet-tabs">
                { tableSet.tables.map(table => (
                    <li key={ table.id } className="ImporterTableSet-tab"
                        onClick={ this.onClickTab.bind(this, table) }>
                        { table.name }
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
