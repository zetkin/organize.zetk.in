import cx from 'classnames';
import React from 'react';
import DropZone from 'react-dropzone';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import ImporterTableSet from './importer/ImporterTableSet';
import { parseImportFile } from '../../../actions/importer';


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

        if (tableSet) {
            return (
                <ImporterTableSet tableSet={ tableSet }
                    dispatch={ this.props.dispatch }/>
            );
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
}
