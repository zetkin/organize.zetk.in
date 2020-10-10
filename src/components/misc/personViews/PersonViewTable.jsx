import React from 'react';

import LoadingIndicator from '../LoadingIndicator';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';


export default class PersonViewTable extends React.Component {
    render() {
        const viewId = this.props.viewId;
        const colList = this.props.columnList;
        const rowList = this.props.rowList;

        let tableHead;
        let tableBody;
        let loadingIndicator;

        if (colList && colList.items) {
            tableHead = (
                <PersonViewTableHead
                    viewId={ viewId }
                    columnList={ colList }
                    openPane={ this.props.openPane }
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
                        isPending={ this.props.rowList && this.props.rowList.addIsPending }
                        onSelect={ this.props.onPersonAdd }/>
                </div>
            </div>
        );
    }
}
