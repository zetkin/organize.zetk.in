import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import { exportPersonView } from '../../actions/personView';


@connect()
@injectIntl
export default class ConfirmExportPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.confirmExport.title' });
    }

    renderPaneContent(data) {
        return [
            <Msg key="p0" tagName="p" id="panes.confirmExport.p0"/>,
            <Msg key="p1" tagName="p" id="panes.confirmExport.p1"/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="ConfirmExportPane-confirmButton"
                labelMsg="panes.confirmExport.confirmButton"
                onClick={ this.onConfirm.bind(this) }/>
        );
    }

    onConfirm(ev) {
        const viewId = this.getParam(0);
        const queryId = this.getParam(1);
        this.props.dispatch(exportPersonView(viewId, queryId));
        this.closePane();
    }
}
