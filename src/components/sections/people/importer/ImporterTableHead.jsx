import React from 'react';

import ImporterColumnHead from './ImporterColumnHead';


export default class ImporterTableHead extends React.Component {
    static propTypes = {
        columnList: React.PropTypes.shape({
            items: React.PropTypes.array.isRequired,
        }).isRequired,
        onChangeColumn: React.PropTypes.func,
    };

    render() {
        let columns = this.props.columnList.items.map(i => i.data);

        return (
            <thead className="ImporterTableHead">
                <tr>
                { columns.map((col, idx) => (
                    <ImporterColumnHead key={ col.id } column={ col }
                        onChangeColumn={ this.props.onChangeColumn }/>
                )) }
                </tr>
            </thead>
        );
    }
}
