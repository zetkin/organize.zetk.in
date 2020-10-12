import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../LoadingIndicator';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';


export default class PersonViewTable extends React.Component {
    render() {
        const viewId = this.props.viewId;
        const colList = this.props.columnList;
        const rowList = this.props.rowList;

        let placeholder;
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
                    placeholder = <LoadingIndicator/>;
                }
                else if (rowList.items && rowList.items.length) {
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
                else {
                    placeholder = this.props.placeholder;
                }
            }
            else {
                placeholder = this.props.placeholder;
            }
        }

        if (placeholder) {
            placeholder = (
                <div className="PersonViewTable-placeholder">
                    { placeholder }
                </div>
            );
        }

        const addSection = this.props.showAddSection? (
            <div className="PersonViewTable-addPerson">
                <PersonSelectWidget
                    isPending={ this.props.rowList && this.props.rowList.addIsPending }
                    onSelect={ this.props.onPersonAdd }/>
            </div>
        ) : null;

        return (
            <div className="PersonViewTable">
                <table>
                    { tableHead }
                    { tableBody }
                </table>
                { placeholder }
                { addSection }
            </div>
        );
    }
}
