import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

const mapStateToProps = (state, props) => ({
});

@connect(mapStateToProps)
@injectIntl
export default class EditSmsDistributionPane extends PaneBase {
    getPaneTitle(data) {
        return 'PLACEHOLDER';
    }

    renderPaneContent(data) {
        return 'PLACEHOLDER';
    }

    renderPaneFooter(data) {
        return 'PLACEHOLDER';
    }
}
