import React from 'react';

import LoadingIndicator from '../LoadingIndicator';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';


export default class PersonViewTable extends React.Component {
    render() {
        const colList = this.props.columnList;
        const rowList = this.props.rowList;

        let tableHead;
        let tableBody;
        let loadingIndicator;

        if (colList && colList.items) {
            tableHead = (
                <PersonViewTableHead
                    columnList={ colList }
                    />
            );

            if (rowList) {
                if (rowList.isPending) {
                    loadingIndicator = <LoadingIndicator/>;
                }
                else if (rowList.items) {
                    tableBody = (
                        <tbody>
                        {rowList.items.map(rowItem => (
                            <PersonViewTableRow key={ rowItem.data.id }
                                columnList={ colList }
                                rowData={ rowItem.data }
                                openPane={ this.props.openPane }
                                />
                        ))}
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
                <div className="PersonViewTable-addPerson">
                    <PersonSelectWidget
                        isPending={ this.props.rowList.addIsPending }
                        onSelect={ this.props.onPersonAdd }/>
                </div>
            </div>
        );
    }
}
