import React from 'react';

import Avatar from '../Avatar';
import LoadingIndicator from '../LoadingIndicator';


export default class PersonViewTable extends React.Component {
    render() {
        const colList = this.props.columnList;
        const rowList = this.props.rowList;

        let tableHead;
        let tableBody;
        let loadingIndicator;

        if (colList && colList.items) {
            tableHead = (
                <thead>
                    <tr>
                        <th></th>
                    {colList.items.map(colItem => (
                        <th>{ colItem.data.title }</th>
                    ))}
                    </tr>
                </thead>
            );

            if (rowList) {
                if (rowList.isPending) {
                    loadingIndicator = <LoadingIndicator/>;
                }
                else if (rowList.items) {
                    tableBody = (
                        <tbody>
                        {rowList.items.map(rowItem => {
                            const cells = rowItem.data.content.map((cellData, index) => (
                                <td key={ index }>{ JSON.stringify(cellData) }</td>
                            ));

                            return (
                                <tr>
                                    <td>
                                        <Avatar
                                            person={{ id: rowItem.data.id }}
                                            onClick={ () => this.props.openPane('person', rowItem.data.id ) }
                                            />
                                    </td>
                                    { cells }
                                </tr>
                            );
                        })}
                        </tbody>
                    );
                }
            }
        }

        return (
            <div className="PersonViewTable">
                <table>
                    { tableHead }
                    { tableBody }
                </table>
                { loadingIndicator }
            </div>
        );
    }
}
