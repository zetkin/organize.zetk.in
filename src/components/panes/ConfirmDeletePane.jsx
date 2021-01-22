import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import DeleteButton from '../misc/DeleteButton';
import PaneBase from './PaneBase';
import { deletePersonView } from '../../actions/personView';


@connect()
@injectIntl
export default class ConfirmDeletePane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.confirmDelete.title' });
    }

    getRenderData() {
        return {
            type: this.getParam(1)
        }
    }

    renderPaneContent(data) {
        let messageId;
        if(data.type == 'view') {
            messageId = "panes.confirmDelete.deleteView";
        }

        return [
            <Msg key="p0" tagName="p" id={ messageId } />,
        ];
    }

    renderPaneFooter(data) {
        return (
            <DeleteButton
                onClick={ this.onConfirm.bind(this) } />
        );
    }

    onConfirm(ev) {
        const id = this.getParam(0);
        const type = this.getParam(1);
        if(type == 'view') {
            this.props.dispatch(deletePersonView(id));
        }
        this.closePane();
    }
}
