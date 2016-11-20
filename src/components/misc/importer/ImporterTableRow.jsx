import React from 'react';

import { resolveValueComponent } from './values';


export default class ImporterTableRow extends React.Component {
    static propTypes = {
        values: React.PropTypes.array.isRequired,
        columns: React.PropTypes.array.isRequired,
    };

    render() {
        let values = this.props.values;
        let columns = this.props.columns;

        return (
            <tr className="ImporterTableRow">
            { values.map((val, idx) => {
                let column = columns[idx];
                let ValueComponent = resolveValueComponent(column);
                let isUnknown = (column.type == "unknown" ? "unknown" : "");

                return (
                    <td key={ columns[idx].id } className={ isUnknown }>
                        <ValueComponent value={ val } column={ column }/>
                    </td>
                );
            }) }
            </tr>
        );
    }
}
