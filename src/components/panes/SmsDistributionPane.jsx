import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import Button from '../misc/Button';
import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';

import {
    retrieveSmsDistribution,
    retrieveSmsDistributionStats,
    updateSmsDistribution,
} from '../../actions/smsDistribution';
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
export default class SmsDistributionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let distributionId = this.getParam(0);

        this.props.dispatch(retrieveSmsDistribution(distributionId));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        clearInterval(this.state.interval);
    }

    componentDidUpdate() {
        const distributionItem = this.props.distributionItem;
        const data = distributionItem && !distributionItem.isPending &&
            distributionItem.data;
        const statsItem = data && data.statsItem;

        if (data && !statsItem) {
            this.props.dispatch(retrieveSmsDistributionStats(data.id));
        }
    }

    getRenderData() {
        const {
            distributionItem,
        } = this.props;

        const isLoaded = distributionItem && !distributionItem.isPending && distributionItem.data;

        const data = distributionItem && distributionItem.data;

        const state = data && data.state;

        const title = data && data.title;
        const sender = data && data.sender;
        const message = data && data.message;

        const sent = data && data.sent;

        const stats = data && data.statsItem && data.statsItem.data;

        return {
            isLoaded,

            state,

            title,
            sender,
            message,

            sent,

            stats,
        };
    }

    getPaneTitle(data) {
        const { distributionItem } = this.props;

        if (!distributionItem || !distributionItem.data || distributionItem.isPending) {
            return null;
        }

        return this.props.distributionItem.data.title;
    }

    renderPaneContent(data) {
        const {
            isLoaded,
            state,
        } = data;

        if (!isLoaded) {
            return <LoadingIndicator />;
        }

        if (state === 'draft') {
            return this.renderDraftPaneContent(data);
        } else if (state === 'confirm') {
            return this.renderConfirmPaneContent(data);
        } else if (state === 'sending') {
            return this.renderSendingPaneContent(data);
        } else if (state === 'sent') {
            return this.renderSentPaneContent(data);
        }
    }

    renderPaneFooter(data) {
        const {
            isLoaded,
            state,
        } = data;

        if (!isLoaded) {
            return <LoadingIndicator />;
        }

        if (state === 'draft') {
            return this.renderDraftPaneFooter(data);
        } else if (state === 'confirm') {
            return this.renderConfirmPaneFooter(data);
        }
    }

    renderCreditsStats(data) {
        return (
            <h3 key="credits">CREDITS PLACEHOLDER</h3>
        )
    }

    // Draft

    renderDraftPaneContent({ title, sender, message, stats }) {
        return (
            <div>
                <InfoList
                    data={[{
                        name: 'title',
                        value: title,
                    }, {
                        name: 'sender',
                        value: sender,
                    }, {
                        name: 'message',
                        value: message,
                    },
                    {
                        name: 'editLink',
                        msgId: 'panes.smsDistribution.editLink',
                        onClick: this.onEditSettingsClick.bind(this),
                    }]}
                />

                <Msg tagName="h3" id="panes.smsDistribution.targets" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList
                        data={[{
                            name: 'num_target_matches',
                            msgId: 'panes.smsDistribution.stats.num_target_matches',
                            msgValues: stats,
                        },
                        {
                            name: 'showTargetsLink',
                            msgId: 'panes.smsDistribution.showTargetsLink',
                            onClick: this.onShowTargetsClick.bind(this),
                        }, {
                            name: 'editTargetQueryLink',
                            msgId: 'panes.smsDistribution.editTargetQueryLink',
                            onClick: this.onEditTargetQueryClick.bind(this),
                        }]}
                    />
                )}
            </div>
        );
    }

    renderDraftPaneFooter(data) {
        return (
            <div>
                {this.renderCreditsStats(data)}
                <Button key="confirm" className="SmsDistributionPane-confirmButton"
                    labelMsg="panes.smsDistribution.confirmButton"
                    onClick={this.onConfirmClick.bind(this)} />
            </div>
        );
    }

    // Confirm

    renderConfirmPaneContent({ title, sender, message, stats }) {
        return (
            <div>
                <InfoList
                    data={[{
                        name: 'title',
                        value: title,
                    }, {
                        name: 'sender',
                        value: sender,
                    }, {
                        name: 'message',
                        value: message,
                    }]}
                />

                <Msg tagName="h3" id="panes.smsDistribution.messages" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                        <InfoList
                            data={[{
                                name: 'num_messages',
                                msgId: 'panes.smsDistribution.stats.num_messages',
                                msgValues: stats,
                            }, {
                                name: 'num_confirm_messages',
                                msgId: 'panes.smsDistribution.stats.num_confirm_messages',
                                msgValues: stats,
                            }, {
                                name: 'num_failed_messages',
                                msgId: 'panes.smsDistribution.stats.num_failed_messages',
                                msgValues: stats,
                            },
                            {
                                name: 'showMessagesLink',
                                msgId: 'panes.smsDistribution.showMessagesLink',
                                onClick: this.onShowMessagesClick.bind(this),
                            }, stats.target_matches_have_changed && {
                                name: 'target_matches_have_changed',
                                msgId: 'panes.smsDistribution.target_matches_have_changed'
                            }]}
                        />
                    )}
            </div>
        );
    }

    renderConfirmPaneFooter(data) {
        return (
            <div>
                {this.renderCreditsStats(data)}
                <Button key="revertToDraft" className="SmsDistributionPane-revertToDraftButton"
                    labelMsg="panes.smsDistribution.revertToDraftButton"
                    onClick={this.onRevertToDraftClick.bind(this)} />
                <Button key="confirm" className="SmsDistributionPane-sendButton"
                    labelMsg="panes.smsDistribution.sendButton"
                    onClick={this.onSendClick.bind(this)} />
            </div>
        );
    }

    // Sending

    renderSendingPaneContent({ title, sender, message, sent, stats }) {
        return (
            <div>
                <InfoList
                    data={[{
                        name: 'title',
                        value: title,
                    }, {
                        name: 'sender',
                        value: sender,
                    }, {
                        name: 'message',
                        value: message,
                    }, {
                        name: 'sent',
                        value: Date.create(sent, { fromUTC: true }).format(),
                    }]}
                />

                <Msg tagName="h3" id="panes.smsDistribution.messages" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList
                        data={[{
                            name: 'num_messages',
                            msgId: 'panes.smsDistribution.stats.num_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_failed_messages',
                            msgId: 'panes.smsDistribution.stats.num_failed_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_confirm_messages',
                            msgId: 'panes.smsDistribution.stats.num_confirmed_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_created_messages',
                            msgId: 'panes.smsDistribution.stats.num_created_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_sent_messages',
                            msgId: 'panes.smsDistribution.stats.num_sent_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_delivered_messages',
                            msgId: 'panes.smsDistribution.stats.num_delivered_messages',
                            msgValues: stats,
                        }, {
                            name: 'showMessagesLink',
                            msgId: 'panes.smsDistribution.showMessagesLink',
                            onClick: this.onShowMessagesClick.bind(this),
                        }]}
                    />
                )}
            </div>
        );
    }

    // Sent

    renderSentPaneContent({ title, sender, message, sent, stats }) {
        return (
            <div>
                <InfoList
                    data={[{
                        name: 'title',
                        value: title,
                    }, {
                        name: 'sender',
                        value: sender,
                    }, {
                        name: 'message',
                        value: message,
                    }, {
                        name: 'sent',
                        value: Date.create(sent, { fromUTC: true }).format(),
                    }]}
                />

                <Msg tagName="h3" id="panes.smsDistribution.messages" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList
                        data={[{
                            name: 'num_messages',
                            msgId: 'panes.smsDistribution.stats.num_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_failed_messages',
                            msgId: 'panes.smsDistribution.stats.num_failed_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_created_messages',
                            msgId: 'panes.smsDistribution.stats.num_created_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_sent_messages',
                            msgId: 'panes.smsDistribution.stats.num_sent_messages',
                            msgValues: stats,
                        }, {
                            name: 'num_delivered_messages',
                            msgId: 'panes.smsDistribution.stats.num_delivered_messages',
                            msgValues: stats,
                        }, {
                            name: 'showMessagesLink',
                            msgId: 'panes.smsDistribution.showMessagesLink',
                            onClick: this.onShowMessagesClick.bind(this),
                        }]}
                    />
                )}
            </div>
        );
    }

    // Handlers

    onEditSettingsClick() {
        const distributionId = this.getParam(0);

        this.openPane('editsmsdistribution', distributionId);
    }

    onShowTargetsClick() {
        const distributionId = this.getParam(0);

        this.openPane('smsdistributiontargets', distributionId);
    }

    onEditTargetQueryClick() {
        const queryId = this.props.distributionItem.data.target.id;

        this.openPane('editquery', queryId);
    }

    onShowMessagesClick() {
        const distributionId = this.getParam(0);

        this.openPane('smsdistributionmessages', distributionId);
    }

    onConfirmClick() {
        const distributionId = this.getParam(0);

        this.props.dispatch(updateSmsDistribution(distributionId, {
            state: 'confirm',
        }));
    }

    onSendClick() {
        const distributionId = this.getParam(0);

        this.props.dispatch(updateSmsDistribution(distributionId, {
            state: 'sending',
        }));
    }

    onRevertToDraftClick() {
        const distributionId = this.getParam(0);

        this.props.dispatch(updateSmsDistribution(distributionId, {
            state: 'draft',
        }));
    }
}
