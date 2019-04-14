import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import SmsDistributionForm from '../forms/SmsDistributionForm';
import Button from '../misc/Button';

import {
    retrieveSmsDistribution,
    updateSmsDistribution,
} from '../../actions/smsDistribution';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';

const mapStateToProps = (state, props) => {
    const distributionId = props.paneData.params[0];

    return {
        distributionItem: getListItemById(
            state.smsDistributions.distributionList,
            distributionId,
        ),
    };
};

@connect(mapStateToProps)
@injectIntl
export default class EditSmsDistributionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let distributionId = this.getParam(0);

        this.props.dispatch(retrieveSmsDistribution(distributionId));
    }

    getRenderData() {
        const {
            distributionItem,
        } = this.props;

        const isLoaded = !!(distributionItem && !distributionItem.isPending && distributionItem.data);

        const data = distributionItem && distributionItem.data;

        const state = data && data.state;

        const title = data && data.title;
        const sender = data && data.sender;
        const message = data && data.message;

        return {
            isLoaded,

            state,

            title,
            sender,
            message,
        };
    }

    getPaneTitle({ isLoaded, title }) {
        const formatMessage = this.props.intl.formatMessage;

        if (!isLoaded) {
            return formatMessage({ id: 'panes.editSmsDistribution.pendingTitle' });
        }

        return formatMessage(
            { id: 'panes.editSmsDistribution.title' },
            { title },
        );
    }

    renderPaneContent({ isLoaded, state, title, sender, message }) {
        if (!isLoaded) {
            return <LoadingIndicator />;
        }

        if (state !== 'draft') {
            return <Msg id="panes.editSmsDistribution.notDraft" />;
        }

        return (
            <SmsDistributionForm key="form" ref="form"
                distribution={{ title, sender, message }}
                onSubmit={this.onSubmit.bind(this)} />
        );
    }

    renderPaneFooter({ state }) {
        if (state !== 'draft') {
            return null;
        }

        return (
            <Button className="EditSmsDistributionPane-saveButton"
                labelMsg="panes.editSmsDistribution.saveButton"
                onClick={this.onSubmit.bind(this)} />
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const distributionId = this.getParam(0);

        const values = this.refs.form.getValues();

        this.props.dispatch(updateSmsDistribution(distributionId, values));
        this.closePane();
    }
}
