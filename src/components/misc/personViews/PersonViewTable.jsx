import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../Button';
import LoadingIndicator from '../LoadingIndicator';
import PageSelect from '../PageSelect';
import PersonSelectWidget from '../PersonSelectWidget';
import PersonViewAddRow from './PersonViewAddRow';
import PersonViewTableHead from './PersonViewTableHead';
import PersonViewTableRow from './PersonViewTableRow';
import {
    addPersonViewRow,
    removePersonViewRow,
    retrievePersonViewRow,
} from '../../../actions/personView';


const MAX_PAGE_SIZE = 500;

@connect()
@injectIntl
export default class PersonViewTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            searchStr: '',
            scrollLeft: 0,
        };

        // Creating this here to avoid having to bind
        this.onScroll = ev => {
            this.setState({
                scrollLeft: ev.target.scrollLeft,
            });
        };
    }

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
        let pageSelect = null;
        let numMatches;
        let numTotal;
        let numVisible;

        if (colList && colList.items) {
            tableHead = (
                <PersonViewTableHead
                    viewId={ viewId }
                    columnList={ colList }
                    openPane={ this.props.openPane }
                    scrollLeft={ this.state.scrollLeft }
                    />
            );

            if (rowList) {
                if (rowList.isPending) {
                    placeholder = <LoadingIndicator/>;
                }
                else if (rowList.items && rowList.items.length) {
                    let visibleRows = rowList.items;

                    // Store total length for label
                    numTotal = visibleRows.length;

                    if (this.state.searchStr && this.state.searchStr.length > 1) {
                        const searchStr = this.state.searchStr.toLowerCase();

                        visibleRows = visibleRows.filter(item => {
                            return item.data.content.some(cell => {
                                if (cell && cell.toLowerCase) {
                                    return cell.toLowerCase().indexOf(searchStr) >= 0;
                                }
                                else {
                                    return false;
                                }
                            });
                        });
                    }

                    // Store match count for label
                    numMatches = visibleRows.length;

                    if (visibleRows.length > MAX_PAGE_SIZE) {
                        const pageCount = Math.ceil(visibleRows.length / MAX_PAGE_SIZE);

                        pageSelect = (
                            <div className="PersonViewTable-pages">
                                <PageSelect
                                    page={ this.state.page }
                                    pageCount={ pageCount }
                                    onChange={ page => this.setState({ page }) }
                                    />
                            </div>
                        );

                        const startIndex = this.state.page * MAX_PAGE_SIZE;
                        const endIndex = (this.state.page + 1) * MAX_PAGE_SIZE;
                        visibleRows = visibleRows.slice(startIndex, endIndex);
                    }

                    // Store final count of visible rows for label
                    numVisible = visibleRows.length;

                    tableBody = (
                        <tbody onScroll={ this.onScroll }>
                        {visibleRows.map(rowItem => (
                            <PersonViewTableRow key={ rowItem.data.id }
                                columnList={ colList }
                                rowData={ rowItem.data }
                                openPane={ this.props.openPane }
                                onAdd={ row => this.props.dispatch(addPersonViewRow(viewId, row.id)) }
                                onRemove={ row => this.props.dispatch(removePersonViewRow(viewId, row.id)) }
                                />
                        ))}
                            <PersonViewAddRow
                                columnList={ colList }
                                rowList={ this.props.rowList }
                                onSelect={ this.props.onPersonAdd }/>
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

        let countMsgId = 'misc.personViewTable.tools.count.default';
        if (this.state.searchStr && pageSelect) {
            countMsgId = 'misc.personViewTable.tools.count.filteredPaginated';
        }
        else if (this.state.searchStr) {
            countMsgId = 'misc.personViewTable.tools.count.filtered';
        }
        else if (pageSelect) {
            countMsgId = 'misc.personViewTable.tools.count.paginated';
        }

        return (
            <div className="PersonViewTable">
                <div className="PersonViewTable-tools">
                    <div className="PersonViewTable-downloadButton">
                        <Button
                            labelMsg="misc.personViewTable.tools.downloadButton"
                            onClick={ this.onClickDownload.bind(this) }
                            />
                    </div>
                    <div className="PersonViewTable-searchInput">
                        <input type="text"
                            placeholder={ this.props.intl.formatMessage({ id: 'misc.personViewTable.tools.search.placeholder' }) }
                            value={ this.state.searchStr }
                            onChange={ ev => this.setState({ searchStr: ev.target.value, page: 0 }) }
                            />
                    </div>
                    { pageSelect }
                    <div className="PersonViewTable-count">
                        { numVisible?
                        <Msg id={ countMsgId }
                            values={{
                                visible: numVisible,
                                matches: numMatches,
                                total: numTotal,
                            }}/> : null }
                    </div>
                </div>
                <div className="PersonViewTable-table">
                    <table>
                        { tableHead }
                        { tableBody }
                    </table>
                </div>
                { placeholder }
            </div>
        );
    }

    onClickDownload() {
        if (this.props.onDownload) {
            this.props.onDownload();
        }
    }
}
