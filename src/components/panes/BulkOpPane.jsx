import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';


const mapStateToProps = (state, props) => ({
    selections: state.selections,
});

@connect(state => mapStateToProps)
@injectIntl
export default class BulkOpPane extends PaneBase {
    getRenderData() {
        return {
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
    }

    renderPaneContent(data) {
    }
}
