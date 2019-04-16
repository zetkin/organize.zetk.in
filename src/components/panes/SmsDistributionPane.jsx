import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import { split as splitter } from 'split-sms';

import PaneBase from './PaneBase';

import Button from '../misc/Button';
import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';

import {
    retrieveSmsDistribution,
    retrieveSmsDistributionStats,
    updateSmsDistribution,
    retrieveSmsDistributionCredits,
} from '../../actions/smsDistribution';
import { getListItemById } from '../../utils/store';

const REFRESH_INTERVAL = 10000;

const mapStateToProps = (state, props) => {
    const distributionId = props.paneData.params[0];

    return {
        distributionItem: getListItemById(
            state.smsDistributions.distributionList,
            distributionId,
        ),
        creditsItem: state.smsDistributions.creditsItem,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let distributionId = this.getParam(0);

        this.props.dispatch(retrieveSmsDistribution(distributionId));
        this.props.dispatch(retrieveSmsDistributionCredits());
    }

    componentDidUpdate() {
        const distributionItem = this.props.distributionItem;
        const data = distributionItem && !distributionItem.isPending &&
            distributionItem.data;
        const statsItem = data && data.statsItem;

        if (data && !statsItem) {
            this.props.dispatch(retrieveSmsDistributionStats(data.id));
        }

        const { interval } = this.state;

        const state = data && data.state;

        if ((state === 'sending' || state === 'sent') && !interval) {
            const interval = setInterval(
                this.onRefreshInterval.bind(this),
                REFRESH_INTERVAL,
            );

            this.setState({
                interval,
            });
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        clearInterval(this.state.interval);
    }

    getRenderData() {
        const {
            distributionItem,
            creditsItem,
        } = this.props;

        const isLoaded = distributionItem && !distributionItem.isPending && distributionItem.data;

        const data = distributionItem && distributionItem.data;

        const state = data && data.state;

        const title = data && data.title;
        const sender = data && data.sender;
        const message = data && data.message;

        const sent = data && data.sent;

        let stats = data && data.statsItem && data.statsItem.data;

        if (stats && state === 'draft') {
            const split = splitter(message);

            stats.amount = split.parts.length * stats.num_target_matches;
        }

        const creditsIsLoaded = !!(creditsItem && !creditsItem.isPending && creditsItem.data);

        const creditsData = creditsItem && creditsItem.data;

        const availableCredits = creditsData && creditsData.available;

        return {
            isLoaded,

            state,

            title,
            sender,
            message,

            sent,

            stats,

            creditsIsLoaded,
            availableCredits,
        };
    }

    getPaneTitle({ isLoaded, title, state }) {
        const formatMessage = this.props.intl.formatMessage;

        if (!isLoaded) {
            return null;
        }

        return formatMessage(
            { id: `panes.smsDistribution.title.${state}` },
            { title },
        );
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

    renderCreditsStats({ stats, creditsIsLoaded, availableCredits }) {
        if (!stats || !creditsIsLoaded) {
            return <LoadingIndicator />;
        }

        const { amount } = stats;

        const cappedAvailableCredits = Math.max(1, availableCredits);
        const cappedAmount = Math.max(0, Math.min(amount, cappedAvailableCredits));
        const relativeWidth = cappedAmount / cappedAvailableCredits;

        return (
            <div className="SmsDistributionPane-creditsInfo">
                <div className="SmsDistributionPane-creditsInfoBar">
                    <div
                        className="SmsDistributionPane-creditsInfoBarInner"
                        style={{ width: 100 * relativeWidth + '%' }}
                    />
                </div>

                <div className="SmsDistributionPane-creditsInfoBarMessage">
                    <div className="SmsDistributionPane-creditsInfoBarMessageTitle">
                        <Msg id="panes.smsDistribution.creditsInfo.title"/>
                    </div>

                    <div className="SmsDistributionPane-creditsInfoBarMessageContent">
                        <Msg id="panes.smsDistribution.creditsInfo.content"
                            values={{ amount, availableCredits: availableCredits }}/>
                    </div>
                </div>

                {amount > availableCredits && (
                    <div className="SmsDistributionPane-creditsInfoBarWarning">
                        <Msg id="panes.smsDistribution.creditsInfo.warning"/>
                    </div>
                )}
            </div>
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


                <Msg tagName="h3" id="panes.smsDistribution.credits.h" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList data={[{
                        name: 'estimated_amount',
                        msgId: 'panes.smsDistribution.credits.estimated_amount',
                        msgValues: stats,
                    }]}/>
                )}

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
        const { stats } = data;

        return (
            <div>
                {this.renderCreditsStats(data)}
                <Button key="confirm" className="SmsDistributionPane-confirmButton"
                    labelMsg="panes.smsDistribution.confirmButton"
                    isDisabled={!stats || !stats.amount}
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

                <Msg tagName="h3" id="panes.smsDistribution.credits.h" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList data={[{
                        name: 'estimated_amount',
                        msgId: 'panes.smsDistribution.credits.estimated_amount',
                        msgValues: stats,
                    }]}/>
                )}


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
        const { stats, availableCredits } = data;


        return (
            <div>
                {this.renderCreditsStats(data)}
                <Button
                    className="SmsDistributionPane-revertToDraftButton"
                    labelMsg="panes.smsDistribution.revertToDraftButton"
                    onClick={this.onRevertToDraftClick.bind(this)} />
                {stats && (
                    stats.amount > availableCredits ? (
                        <Button
                            className="SmsDistributionPane-purchaseCreditsButton"
                            labelMsg="panes.smsDistribution.purchaseCreditsButton"
                            onClick={this.onPurchaseCreditsClick.bind(this)} />
                    ) : (
                        <Button
                            className="SmsDistributionPane-sendButton"
                            labelMsg="panes.smsDistribution.sendButton"
                            onClick={this.onPurchaseCreditsClick.bind(this)} />
                    )
                )}
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

                <Msg tagName="h3" id="panes.smsDistribution.credits.h" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList data={[{
                        name: 'reserved_amount',
                        msgId: 'panes.smsDistribution.credits.reserved_amount',
                        msgValues: stats,
                    }]}/>
                )}

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

                <Msg tagName="h3" id="panes.smsDistribution.credits.h" />
                {!stats ? (
                    <LoadingIndicator />
                ) : (
                    <InfoList data={[{
                        name: 'amount',
                        msgId: 'panes.smsDistribution.credits.amount',
                        msgValues: stats,
                    }]}/>
                )}

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

    onRefreshInterval() {
        const distributionId = this.getParam(0);

        this.props.dispatch(retrieveSmsDistributionStats(distributionId));
    }

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

    onPurchaseCreditsClick() {
        this.openPane('purchasesmsdistributioncredits');
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
