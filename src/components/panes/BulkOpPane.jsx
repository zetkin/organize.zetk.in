import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import { resolveConfig } from '../bulk/config';
import { getListItemById } from '../../utils/store';


const mapStateToProps = (state, props) => ({
    selections: state.selections,
});

@connect(state => mapStateToProps)
@injectIntl
export default class BulkOpPane extends PaneBase {
    getRenderData() {
        let selectionList = this.props.selections.selectionList;
        let selectionId = this.getParam(1);
        let selectionItem = getListItemById(selectionList, selectionId);

        return {
            config: null,
            selection: selectionItem.data
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        let id = 'panes.bulkOp.headers.' + this.getParam(0);
        let count = data.selection.selectedIds.length;

        return formatMessage({ id }, { count });
    }

    renderPaneContent(data) {
        let ConfigComponent = resolveConfig(this.getParam(0));
        let config = this.state.config || {};

        return (
            <ConfigComponent config={ config }
                onConfigChange={ this.onConfigChange.bind(this) }
                openPane={ this.openPane.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        if (this.state.config) {
            return (
                <Button labelMsg="panes.bulkOp.submitButton"
                    onClick={ this.onSubmitButtonClick.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    onConfigChange(config) {
        this.setState({
            config
        });
    }

    onSubmitButtonClick() {
        // TODO: Execute bulk op on back-end
        console.log(this.state.config);
    }
}
