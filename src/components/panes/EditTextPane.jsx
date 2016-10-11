import React from 'react';
import Editor from 'react-medium-editor';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import { saveTextDocument, finishTextDocument } from '../../actions/document';


@connect(state => state)
@injectIntl
export default class EditTextPane extends PaneBase {
    getRenderData() {
        let docId = this.getParam(0);
        let docList = this.props.documents.docList;

        return {
            docItem: getListItemById(docList, docId),
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.editText.title' });
    }

    renderPaneContent(data) {
        if (data.docItem) {
            let content = data.docItem.data.content;

            return [
                <Editor className="EditTextPane-editor"
                    key="editor" tag="div" text={ content }
                    onChange={ this.onChange.bind(this) }/>,
            ];
        }
        else {
            return null;
        }
    }

    renderPaneFooter(data) {
        return [
            <Button key="closeButton"
                className="EditTextPane-closeButton"
                labelMsg="panes.editText.closeButton"
                onClick={ this.onClickCancel.bind(this) }/>,
            <Button key="saveButton"
                className="EditTextPane-saveButton"
                labelMsg="panes.editText.saveButton"
                onClick={ this.onClickFinish.bind(this) }/>,
        ];
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
