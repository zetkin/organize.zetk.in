import React from 'react';
import Editor from 'react-medium-editor';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { saveTextDocument, finishTextDocument } from '../../actions/document';


@connect(state => state)
export default class EditTextPane extends PaneBase {
    getRenderData() {
        let docId = this.getParam(0);
        let docList = this.props.documents.docList;

        return {
            docItem: getListItemById(docList, docId),
        };
    }

    getPaneTitle(data) {
        return 'Edit text';
    }

    renderPaneContent(data) {
        if (data.docItem) {
            let content = data.docItem.data.content;

            return [
                <button key="finishButton"
                    onClick={ this.onClickFinish.bind(this) }>
                    Save and close</button>,
                <button key="cancelButton"
                    onClick={ this.onClickCancel.bind(this) }>
                    Close without saving</button>,
                <Editor className="EditTextPane-editor"
                    key="editor" tag="div" text={ content }
                    onChange={ this.onChange.bind(this) }/>,
            ];
        }
        else {
            return null;
        }
    }

    onClickFinish(ev) {
        let docId = this.getParam(0);
        this.props.dispatch(finishTextDocument(docId));
        this.closePane();
    }

    onClickCancel(ev) {
        this.closePane();
    }

    onChange(text, medium) {
        let docId = this.getParam(0);

        // TODO: Remove saveSelection/restoreSelection once bug is fixed in the
        //       react-medium-editor component library.
        medium.saveSelection();
        this.props.dispatch(saveTextDocument(docId, text));
        medium.restoreSelection();
    }
}
