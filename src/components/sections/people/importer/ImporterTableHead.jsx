import React from 'react';

import ImporterColumnHead from './ImporterColumnHead';


export default class ImporterTableHead extends React.Component {
    static propTypes = {
        columns: React.PropTypes.array.isRequired,
    };

    render() {
        let columns = this.props.columns;

        return (
            <thead className="ImporterTableHead">
                <tr>
                { columns.map((col, idx) => (
                    <ImporterColumnHead key={ col.id } column={ col }/>
                )) }
                </tr>
            </thead>
        );
    }
}
