import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import SmsDistributionMessageList from '../lists/SmsDistributionMessageList';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import {
    retrieveSmsDistributionMessages,
} from '../../actions/smsDistribution';
import { createList } from '../../utils/store';

const mapStateToProps = (state, { paneData: { params: [id] } }) => ({
    distribution: getListItemById(state.smsDistributions.distributionList, id),
    messages: state.smsDistributions.messagesByDistribution[id],
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionMessagesPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const {
            messages,
            paneData: {
                params: [distributionId],
            },
        } = this.props;

        if (!messages) {
            this.props.dispatch(retrieveSmsDistributionMessages(distributionId));
        }
    }

    getRenderData() {
        return {
            distribution: this.props.distribution,
            messages: this.props.messages,
        }
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        return formatMessage({ id: 'panes.smsDistributionMessages.title' });
    }

    getPaneSubTitle({ distribution }) {
        return distribution && distribution.data && distribution.data.title;
    }

    renderPaneContent({ messages }) {
        if (!messages || messages.isPending) {
            return <LoadingIndicator />;
        }

        const onItemClick = this.onItemClick.bind(this);

        const filterMessages = (fn) => createList(messages.items.map(i => i
            .data).filter(fn));

        const queuedMessages = filterMessages(m => m.status === 'confirm' || m
            .status === 'created');
        const sentMessages = filterMessages(m => m.status === 'sent');
        const deliveredMessages = filterMessages(m => m.status === 'delivered');
        const failedMessages = filterMessages(m => m.status === 'error');

        return [
            (failedMessages.items.length > 0 && (
                <div key="failed" className="SmsDistributionMessagesPane-failed">
                    <Msg tagName="h3" id="panes.smsDistributionMessages.failed"
                        values={{ count: failedMessages.items.length }} />
                    <SmsDistributionMessageList messageList={failedMessages}
                        sortByDefault={true} onItemClick={onItemClick}
                    />
                </div>
            )),
            (queuedMessages.items.length > 0 && (
                <div key="queued" className="SmsDistributionMessagesPane-queued">
                    <Msg tagName="h3" id="panes.smsDistributionMessages.queued"
                        values={{ count: queuedMessages.items.length }} />
                    <SmsDistributionMessageList messageList={queuedMessages}
                        sortByDefault={true} onItemClick={onItemClick}
                    />
                </div>
            )),
            (sentMessages.items.length > 0 && (
                <div key="sent" className="SmsDistributionMessagesPane-sent">
                    <Msg tagName="h3" id="panes.smsDistributionMessages.sent"
                        values={{ count: sentMessages.items.length }} />
                    <SmsDistributionMessageList messageList={sentMessages}
                        sortByDefault={true} onItemClick={onItemClick}
                    />
                </div>
            )),
            (deliveredMessages.items.length > 0 && (
                <div key="delivered" className="SmsDistributionMessagesPane-delivered">
                    <Msg tagName="h3" id="panes.smsDistributionMessages.delivered"
                        values={{ count: deliveredMessages.items.length }} />
                    <SmsDistributionMessageList messageList={deliveredMessages}
                        sortByDefault={true} onItemClick={onItemClick}
                    />
                </div>
            )),
        ];
    }

    onItemClick(item, event) {
        if (event && event.altKey) {
            this.openPane('editperson', item.data.target.id);
        } else {
            this.openPane('person', item.data.target.id);
        }
    }
}
