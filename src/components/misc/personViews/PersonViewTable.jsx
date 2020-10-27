import { csvFormatRows } from 'd3-dsv';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../Button';
import LoadingIndicator from '../LoadingIndicator';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';
import {
    addPersonViewRow,
    removePersonViewRow,
    retrievePersonViewRow,
} from '../../../actions/personView';


@connect()
export default class PersonViewTable extends React.Component {
    componentDidUpdate() {
        const { columnList, rowList, viewId } = this.props;

        if (rowList && rowList.items) {
            // Find dirty rows and retrieve their data anew
            rowList.items.forEach(rowItem => {
                if (rowItem.data && rowItem.data.dirty) {
                    this.props.dispatch(retrievePersonViewRow(viewId, rowItem.data.id));
                }
            });
        }
    }

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
                                onAdd={ row => this.props.dispatch(addPersonViewRow(viewId, row.id)) }
                                onRemove={ row => this.props.dispatch(removePersonViewRow(viewId, row.id)) }
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
                <div className="PersonViewTable-tools">
                    <Button
                        className="PersonViewTable-downloadButton"
                        labelMsg="misc.personViewTable.tools.downloadButton"
                        onClick={ this.onClickDownload.bind(this) }
                        />
                </div>
                <table>
                    { tableHead }
                    { tableBody }
                </table>
                { placeholder }
                { addSection }
            </div>
        );
    }

    onClickDownload() {
        const { columnList, rowList, viewId } = this.props;

        const rows = [];

        if (columnList && columnList.items && rowList && rowList.items) {
            // Start with the header
            rows.push(['Zetkin ID'].concat(columnList.items.map(colItem => colItem.data.title)));

            // Find dirty rows and retrieve their data anew
            rowList.items.forEach(rowItem => {
                const data = rowItem.data;
                rows.push([data.id].concat(data.content));
            });
        }

        // Download CSV
        const csvStr = csvFormatRows(rows);
        const blob = new Blob([ csvStr ], { type: 'text/csv' });
        const a = document.createElement('a');
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', 'view.csv');
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
    }
}
