import cx from 'classnames';
import React from 'react';
import DropZone from 'react-dropzone';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
import PaneBase from '../../panes/PaneBase';
import ImporterTableSet from '../../misc/importer/ImporterTableSet';
import LoadingIndicator from '../../misc/LoadingIndicator';
import { parseImportFile, resetImport } from '../../../actions/importer';


@connect(state => ({ importer: state.importer }))
export default class ImportPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
        };
    }

    renderPaneContent(data) {
        let classes = cx('ImportPane-dropZone', {
            'ImportPane-dropZone-isDragging': this.state.isDragging,
        });

        let tableSet = this.props.importer.tableSet;
        let stats = this.props.importer.importStats;
        let isPending = this.props.importer.importIsPending;

        if (isPending) {
            return <LoadingIndicator />;
        }
        else if (tableSet) {
            return (
                <ImporterTableSet tableSet={ tableSet }
                    onEditColumn={ this.onEditColumn.bind(this) }
                    dispatch={ this.props.dispatch }/>
            );
        }
        else if (stats) {
            return [
                <h1>Import complete</h1>,
                <ul>
                    <li>Imported: { stats.num_imported }</li>
                    <li>Created: { stats.num_created }</li>
                    <li>Updated: { stats.num_updated }</li>
                    <li>Tagged: { stats.num_tagged }</li>
                </ul>,
                <Button label="Import more"
                    onClick={ this.onClickReset.bind(this) }/>
            ];
        }
        else {
            return [
                <DropZone key="dropZone" className={ classes }
                    onDragEnter={ this.onDragEnter.bind(this) }
                    onDragLeave={ this.onDragLeave.bind(this) }
                    onDrop={ this.onDrop.bind(this) }/>
            ];
        }
    }

    onEditColumn(table, col) {
        this.openPane('importercolumn', table.id, col.id);
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
}
