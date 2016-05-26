import cx from 'classnames';
import DropZone from 'react-dropzone';
import React from 'react';
import xlsx from 'xlsx';

import PaneBase from '../../panes/PaneBase';


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

        return [
            <DropZone key="dropZone" className={ classes }
                onDragEnter={ this.onDragEnter.bind(this) }
                onDragLeave={ this.onDragLeave.bind(this) }
                onDrop={ this.onDrop.bind(this) }/>
        ];
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
        let reader = new FileReader();

        // TODO: Do this async operation in action instead?
        reader.onload = e => {
            let data = e.target.result;
            let wb = xlsx.read(data, { type: 'binary' });

            console.log(wb);
        };

        reader.readAsBinaryString(file);
    }
}
