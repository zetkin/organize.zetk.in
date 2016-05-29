import React from 'react';


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
            { values.map((val, idx) => (
                <td key={ columns[idx].id }>{ val }</td>
            )) }
            </tr>
        );
    }
}
