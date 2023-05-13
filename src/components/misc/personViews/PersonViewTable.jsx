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
            sortIndex: null,
            sortInverted: false,
        };

        // Creating this here to avoid having to bind
        this.onScroll = ev => {
            this.setState({
                scrollLeft: ev.target.scrollLeft,
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.rowList || !nextProps.rowList.items.length) {
            this.setState({
                scrollLeft: 0,
            });
        }
    }

    componentDidUpdate() {
        const { rowList, viewId } = this.props;

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
                    sortIndex={ this.state.sortIndex }
                    sortInverted={ this.state.sortInverted }
                    onSort={ this.onSort.bind(this) }
                    />
            );

            if (rowList) {
                if (rowList.isPending) {
                    placeholder = <LoadingIndicator/>;
                } else {
                    placeholder = this.props.placeholder;
                }

                if (rowList.items && rowList.items.length) {
                    let visibleRows = rowList.items;

                    // Store total length for label
                    numTotal = visibleRows.length;

                    if (this.state.searchStr && this.state.searchStr.length > 1) {
                        const searchStr = this.state.searchStr.toLowerCase();

                        visibleRows = visibleRows.filter(item => {
                            return item.data.content.some((cell, idx) => {
                                const col = colList.items[idx].data;

                                let text = null;

                                if (cell && col.type == 'survey_response') {
                                    text = cell.map(r => r.text).join('\n');
                                }
                                else if (typeof cell == 'string') {
                                    text = cell;
                                }

                                if (text) {
                                    return text.toLowerCase().indexOf(searchStr) >= 0;
                                }
                                else {
                                    return false;
                                }
                            });
                        });
                    }

                    // Sort, if a column is selected for sorting
                    if (this.state.sortIndex !== null) {
                        const colType = colList.items[this.state.sortIndex].data.type;

                        // Reducer function for joining objects with text attributes
                        const joinText = (joined, object) => joined + object.text;

                        visibleRows = visibleRows.concat().sort((row0, row1) => {
                            let val0 = row0.data.content[this.state.sortIndex];
                            let val1 = row1.data.content[this.state.sortIndex] || null;

                            let x = 0;

                            if (colType == 'local_bool' || colType == 'person_query') {
                                // Treat boolean values as integers (1 or 0)
                                x = +val1 - +val0;
                            }
                            else if (colType == 'person_tag') {
                                x = !!val0 < !!val1 ? 1 : -1;
                            }
                            else if (colType == 'survey_option') {
                                // Find whether option has been selected in any of the submissions and treat bool as integer
                                x = +!!val1.find(s => s.selected) - +!!val0.find(s => s.selected);
                            }
                            else if (colType == 'survey_options') {
                                // Find latest submissions with any selected options
                                const findLatest = (latest, submission) => 
                                    !latest.selected.length || 
                                        submission.submission_id >= latest.submission_id && 
                                        submission.selected.length ? submission : latest;

                                const latest0 = val0.reduce(findLatest, { selected: [] });
                                const latest1 = val1.reduce(findLatest, { selected: [] });

                                // Return -1, 0 or 1 by comparing joined options of latest submissions
                                // Reducer joins option object texts
                                const joinedOptions0 = latest0.selected.reduce(joinText, '');
                                const joinedOptions1 = latest1.selected.reduce(joinText, '');
                                x = joinedOptions0.localeCompare(joinedOptions1);
                            } 
                            else if (colType == 'person_notes') {
                                const joinedNotes0 = val0.reduce(joinText, '');
                                const joinedNotes1 = val1.reduce(joinText, '');
                                x = joinedNotes0.localeCompare(joinedNotes1);
                            }
                            else if (colType == 'local_person') {
                                const name0 = val0 ? val0.first_name + val0.last_name : '';
                                const name1 = val1 ? val1.first_name + val1.last_name : '';
                                x = name0.localeCompare(name1);
                            }
                            else if (colType == 'survey_response') {
                                const joinedResponses0 = val0.reduce(joinText, '');
                                const joinedResponses1 = val1.reduce(joinText, '');
                                x = joinedResponses0.localeCompare(joinedResponses1);
                            }
                            else if (colType == 'survey_submitted') {
                                const getLatest = (latest, sub) => latest ? (new Date(sub.submitted) > new Date(latest.submitted) ? sub : latest) : sub;
                                const latest0 = val0.reduce(getLatest, { submitted: 0 });
                                const latest1 = val1.reduce(getLatest, { submitted: 0 });
                                x = new Date(latest1.submitted) < new Date(latest0.submitted) ? 1 : -1;
                            }
                            else if (!val0) {
                                return val1? 1 : 0;
                            }
                            else if (!val1) {
                                return val0? -1 : 0;
                            }
                            else if (Array.isArray(val0)) {
                                if (typeof val0[0] != 'undefined' && typeof val1[0] != 'undefined') {
                                    if (val0[0].text && val1[0].text) {
                                        x = val0[0].text.localeCompare(val1[0].text);
                                    }
                                    else if (val0[0].submitted && val1[0].submitted) {
                                        x = new Date(val0[0].submitted) - new Date(val1[0].submitted);
                                    }
                                    else {
                                        x = 0;
                                    }
                                }
                                else {
                                    if(typeof(val0[0]) == 'undefined' && typeof(val1[0]) != 'undefined') {
                                        return 1;
                                    }
                                    if(typeof(val0[0]) != 'undefined' && typeof(val1[0]) == 'undefined') {
                                        return -1;
                                    }
                                    if(typeof(val0[0]) == 'undefined' && typeof(val1[0]) == 'undefined') {
                                        return 0;
                                    }
                                }
                            }
                            else {
                                if (colType == 'local_person') {
                                    val0 = `${val0.first_name} ${val0.last_name}`;
                                    val1 = `${val1.first_name} ${val1.last_name}`;
                                }

                                x = val0.localeCompare(val1);
                            }

                            if (this.state.sortInverted) {
                                x *= -1;
                            }

                            return x;
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
                                viewId={ viewId }
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
                    tableBody = (
                        <tbody>
                            <tr className="PersonViewTable-placeholder">
                                <td/>
                                <td/>
                                <td colSpan={3}>
                                    { placeholder }
                                </td>
                            </tr>
                            <PersonViewAddRow
                                    columnList={ colList }
                                    rowList={ this.props.rowList }
                                    onSelect={ this.props.onPersonAdd }/>
                        </tbody>
                    )
                }
            }
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
            </div>
        );
    }

    onSort(idx) {
        // Already sorting?
        if (this.state.sortIndex == idx) {
            if (this.state.sortInverted) {
                // Already inverted. Reset sort!
                this.setState({
                    sortIndex: null,
                    sortInverted: false,
                });
            }
            else {
                // Not inverted. Invert!
                this.setState({
                    sortInverted: true,
                });
            }
        }
        else {
            // Not already sorting. Sort default (not inverted).
            this.setState({
                sortIndex: idx,
                sortInverted: false,
            });
        }
    }

    onClickDownload() {
        if (this.props.onDownload) {
            this.props.onDownload();
        }
    }
}
