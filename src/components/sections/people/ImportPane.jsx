import cx from 'classnames';
import React from 'react';
import DropZone from 'react-dropzone';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import ImporterTableSet from '../../misc/importer/ImporterTableSet';
import LoadingIndicator from '../../misc/LoadingIndicator';
import ImportLogList from '../../lists/ImportLogList'
import {
    parseImportFile,
    resetImport,
    resetImportError,
    retrieveImportLogs
} from '../../../actions/importer';


@connect(state => ({ importer: state.importer }))
export default class ImportPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            isDragging: false,
            viewMode: 'import',
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.viewMode != prevState.viewMode) {
            if (this.state.viewMode == 'logs') {
                this.props.dispatch(retrieveImportLogs());
            }
        }
    }

    renderPaneContent(data) {
        let classes = cx('ImportPane-dropZone', {
            'ImportPane-dropZone-isDragging': this.state.isDragging,
        });

        let tableSet = this.props.importer.tableSet;
        let response = this.props.importer.importResponse;
        let isPending = this.props.importer.importIsPending;
        let importError = this.props.importer.importError;
        let parseError = this.props.importer.parseError;
        let importLogList = this.props.importer.importLogList;

        if(this.state.viewMode == 'import') {
            if (isPending) {
                return <LoadingIndicator />;
            }
            else if (importError) {
                return (
                    <div className="ImportPane-error">
                        <Msg tagName="h1" id="panes.import.error.h"/>
                        <Msg tagName="p" id="panes.import.error.p"/>
                        <Button labelMsg="panes.import.error.backButton"
                            onClick={ this.onErrorBackButtonClick.bind(this) }
                            />
                        <Button labelMsg="panes.import.error.resetButton"
                            onClick={ this.onErrorResetButtonClick.bind(this) }
                            />
                    </div>
                );
            }
            else if (parseError) {
                return (
                    <div className="ImportPane-error">
                        <Msg tagName="h1" id="panes.import.parseError.h"/>
                        <Msg tagName="p" id="panes.import.parseError.p"/>
                        <Button labelMsg="panes.import.error.resetButton"
                            onClick={ this.onErrorResetButtonClick.bind(this) }
                            />
                    </div>
                );
            }
            else if (tableSet) {
                return (
                    <ImporterTableSet tableSet={ tableSet }
                        onEditColumn={ this.onEditColumn.bind(this) }
                        onConfirmImport={ this.onConfirmImport.bind(this) }
                        dispatch={ this.props.dispatch }/>
                );
            }
            else if (response && response.status == "completed") {
                return (
                    <div className="ImportPane-report">
                        <Msg tagName="h1" id="panes.import.report.h"
                            values={{ count: response.report.imported }}/>
                        <ul>
                            <li><Msg id="panes.import.report.numCreated"
                                values={{ count: response.report.created }}/></li>
                            <li><Msg id="panes.import.report.numUpdated"
                                values={{ count: response.report.updated }}/></li>
                            <li><Msg id="panes.import.report.numTagged"
                                values={{ count: response.report.tagged }}/></li>
                        </ul>
                        <Button labelMsg="panes.import.importMoreButton"
                            onClick={ this.onClickReset.bind(this) }/>
                    </div>
                );
            }
            else if (response && response.status == "pending") {
                return (
                    <div className="ImportPane-report">
                        <Msg tagName="h1" id="panes.import.pending.h"/>
                        <Msg tagName="p" id="panes.import.pending.p"/>
                        <Button labelMsg="panes.import.importMoreButton"
                            onClick={ this.onClickReset.bind(this) }/>
                    </div>
                )
            }
            else {
                return [
                    <DropZone key="dropZone" className={ classes }
                        onDragEnter={ this.onDragEnter.bind(this) }
                        onDragLeave={ this.onDragLeave.bind(this) }
                        onDrop={ this.onDrop.bind(this) }>
                        <div className="ImportPane-dropZoneMessage" >
                            <Msg tagName="p" id="panes.import.importDropZoneMessage"/>
                        </div>
                    </DropZone>
                ];
            }
        } else if (this.state.viewMode == 'logs') {
            return <ImportLogList 
                        key="importLogList"
                        importLogList={ importLogList }
                        onItemClick={ this.onLogItemClick.bind(this) } />
        }
    }

    onEditColumn(table, col) {
        this.openPane('importercolumn', table.id, col.id);
    }

    onConfirmImport(tableId) {
        this.openPane('confirmimport', tableId);
    }

    onDragEnter(ev) {
        this.setState({
            isDragging: true,
        });
    }

    onDragLeave(ev) {
        this.setState({
            isDragging: false,
        });
    }

    onDrop(files) {
        this.setState({
            isDragging: false,
        });

        // TODO: Check file count, format et c

        let file = files[0];
        this.props.dispatch(parseImportFile(file));
    }

    onClickReset() {
        this.props.dispatch(resetImport());
    }

    onErrorBackButtonClick() {
        this.props.dispatch(resetImportError());
    }

    onErrorResetButtonClick() {
        this.props.dispatch(resetImport());
    }

    onLogItemClick(item) {
        this.openPane('importlog', item.data.id);
    }

    getPaneTools(data) {
        const viewStates = {
            'import': 'panes.import.viewSwitch.import',
            'logs': 'panes.import.viewSwitch.logs',
        };

        let tools = [
            <ViewSwitch key="viewSwitch"
                states={ viewStates } selected={ this.state.viewMode }
                onSwitch={ vs => this.setState({ viewMode: vs }) }
                />,
        ];

        return tools;
    }
}
