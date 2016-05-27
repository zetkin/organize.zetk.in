import React from 'react';

import ImporterTable from './ImporterTable';


export default class ImporterTableSet extends React.Component {
    static propTypes = {
        tableSet: React.PropTypes.object.isRequired,
    };

    render() {
        let tableSet = this.props.tableSet;

        return (
            <div className="ImporterTableSet">
            { tableSet.tables.map((table, idx) => (
                <ImporterTable key={ idx } table={ table }/>
            )) }
            </div>
        );
    }
}
