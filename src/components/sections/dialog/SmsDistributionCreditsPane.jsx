import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import {
    retrieveSmsDistributionCredits,
} from '../../../actions/smsDistribution';

const mapStateToProps = state => ({
    creditsItem: state.smsDistributions.creditsItem,
});

@connect(mapStateToProps)
export default class SmsDistributionCreditsPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSmsDistributionCredits());
    }

    getRenderData() {
        const {
            creditsItem,
        } = this.props;

        return {
        };
    }

    renderPaneContent(data) {
        return 'CONTENT PLACEHOLDER';
    }
}
