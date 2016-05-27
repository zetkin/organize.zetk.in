import React from 'react';


export default class ImporterColumnHead extends React.Component {
    static propTypes = {
        column: React.PropTypes.object.isRequired,
    };

    render() {
        let column = this.props.column;

        return (
            <th className="ImporterColumnHead">
                { column.name || column.id }
            </th>
        );
    }
}
