import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../LoadingIndicator';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';
import {
    addPersonViewRow,
    removePersonViewRow,
    retrievePersonViewRow,
} from '../../../actions/personView';
import PageSelect from "../PageSelect";

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

    onChangeHandler = () => {
        console.log("page whatever");
    }

    render() {
        const viewId = this.props.viewId;
        const colList = this.props.columnList;
        const rowList = this.props.rowList;
        const pageLimit = 10;

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
                } else if (rowList.items && rowList.items.length) {
                    tableBody = (
                        <tbody>
                        {rowList.items.map(rowItem => (
                            <PersonViewTableRow key={ rowItem.data.id }
                                columnList={colList}
                                rowData={ rowItem.data }
                                openPane={ this.props.openPane }
                                onAdd={ row => this.props.dispatch(addPersonViewRow(viewId, row.id)) }
                                onRemove={ row => this.props.dispatch(removePersonViewRow(viewId, row.id)) }
                            />
                        ))}
                        </tbody>
                    );
                } else {
                    placeholder = this.props.placeholder;
                }
            } else {
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

        const addSection = this.props.showAddSection ? (
            <div className="PersonViewTable-addPerson">
                <PersonSelectWidget
                    isPending={ this.props.rowList && this.props.rowList.addIsPending }
                    onSelect={ this.props.onPersonAdd }/>
            </div>
        ) : null;

        let pageSelect = null;

        if (rowList && rowList.items.length > pageLimit) {
            pageSelect = (
                <div className='PageSelect'>
                    <PageSelect pageCount={ this.totalPages = Math.ceil(rowList.items.length / pageLimit) }
                                pageLimit={ pageLimit }
                                onChange={ this.onChangeHandler }/>
                </div>
            );
        }

        return (
            <div className="PersonViewTable">
                { pageSelect }
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