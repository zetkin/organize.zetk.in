import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

const mapStateToProps = () => ({
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionMessagesPane extends PaneBase {
    getPaneTitle(data) {
        return 'PLACEHOLDER';
    }

    getPaneSubTitle({ distribution }) {
        return 'PLACEHOLDER';
    }

    renderPaneContent({ messages }) {
        return 'PLACEHOLDER';
    }
}
