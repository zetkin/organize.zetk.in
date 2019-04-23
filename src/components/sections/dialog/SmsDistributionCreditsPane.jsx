import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';

import LoadingIndicator from '../../misc/LoadingIndicator';

import {
    retrieveSmsDistributionCredits,
} from '../../../actions/smsDistribution';
import Button from '../../misc/Button';
import Link from '../../../components/misc/Link';
import InfoList from '../../misc/InfoList';

const cn = (suffix = '') => `SmsDistributionCreditsPane${suffix}`;
const msgId = suffix => `panes.smsDistributionCredits.${suffix}`;

const oreToKrona = (ore = 0) => (ore / 100).toFixed(2);

const mapStateToProps = state => ({
    creditsItem: state.smsDistributions.creditsItem,
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionCreditsPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSmsDistributionCredits());
    }

    getRenderData() {
        const {
            creditsItem,
            intl: {
                formatMessage,
            },
        } = this.props;

        const isLoaded = !!(creditsItem && !creditsItem.isPending && creditsItem.data);

        if (!isLoaded) {
            return {
                formatMessage,

                isLoaded,
            };
        }

        const creditsData = creditsItem.data;

        const {
            available: availableCredits,
            stats,
        } = creditsData;

        const statsKeys = Object.keys(stats).sort();

        const now = new Date();
        const year = now.getFullYear();

        const numberOfChargesThisYear = statsKeys
            .filter(k => k.startsWith(year))
            .reduce((num, key) => num + stats[key].num_purchase, 0);
        const sumOfChargesThisYear = statsKeys
            .filter(k => k.startsWith(year))
            .reduce((sum, key) => sum + stats[key].sum_purchase_charge, 0);

        const balanceHistory = [];
        statsKeys.forEach((k, i) => {
            const previousBalance = balanceHistory[i - 1] || 0;
            const balance = previousBalance + stats[k].sum;

            balanceHistory.push(balance);
        });

        balanceHistory.splice(0, balanceHistory.length - 12);
        while (balanceHistory.length < 12) {
            balanceHistory.splice(0, 0, 0);
        }

        return {
            formatMessage,

            isLoaded,

            availableCredits,
            sumOfChargesThisYear,
            numberOfChargesThisYear,
            balanceHistory,
        };
    }

    renderPaneContent(data) {
        const {
            isLoaded,
        } = data;

        if (!isLoaded) {
            return <LoadingIndicator />
        }

        return (
            <div className={cn()}>
                <div className={cn('-row')}>
                    <div className={cn('-col')}>
                        {this.renderAvailableCredits(data)}
                    </div>
                    <div className={cn('-col')}>
                        {this.renderAbout(data)}
                    </div>
                </div>
                <div className={cn('-row')}>
                    <div className={cn('-col')}>
                        {this.renderBalanceHistory(data)}
                    </div>
                    <div className={cn('-col')}>
                        {this.renderPurchaseHistory(data)}
                    </div>
                </div>
            </div>
        );
    }

    renderAbout({ formatMessage }) {
        return (
            <div className={cn('-about')}>
                <Msg tagName="h3" id={msgId('about.title')} />

                <div className={cn('-aboutInner')}>
                    <div className={cn('-aboutContent')}>
                        <Msg id={msgId('about.content')} values={{
                            readMoreLink: <Link
                                msgId={msgId('about.contentReadMoreLink')}
                                href={formatMessage({ id: msgId('about.readMoreUrl') })}
                                target="_blank" />
                        }} />
                    </div>

                    <Link msgId={msgId('about.readMoreLink')}
                        className={cn('-aboutReadMoreLink')}
                        href={formatMessage({ id: msgId('about.readMoreUrl') })}
                        target="_blank" />
                </div>
            </div>
        );
    }

    renderAvailableCredits({ availableCredits }) {
        return (
            <div className={cn('-availableCredits')}>
                <Msg tagName="h3" id={msgId('availableCredits.title')} />

                <div className={cn('-availableCreditsInner')}>
                    <Msg id={msgId('availableCredits.credits')}
                        values={{ credits: availableCredits }} />
                </div>

                <Button labelMsg={msgId('availableCredits.purchaseButton')}
                    onClick={this.onPurchaseCreditsClick.bind(this)} />
            </div>
        )
    }

    renderBalanceHistory({ balanceHistory }) {
        const monthWidth = 10;
        const height = 50;
        const topPadding = 5;

        const maxBalance = balanceHistory.reduce((a, b) => Math.max(a, b));

        const points = [
            [11 * monthWidth, height],
            [0, height],
            ...balanceHistory.map((v, i) => [
                i * monthWidth,
                height - v / maxBalance * (height - topPadding),
            ]),
        ].map(p => p.join(' ')).join(', ');

        return (
            <div className={cn('-balanceHistory')}>
                <Msg tagName="h3" id={msgId('balanceHistory.title')} />

                <div className={cn('-balanceHistoryInner')}>
                    <svg className={cn('-balanceHistoryContent')}
                        viewBox={`0 0 ${11 * monthWidth} ${height}`}>
                        <polygon points={points}/>
                    </svg>

                    <Link msgId={msgId('balanceHistory.viewAllLink')}
                        className={cn('-balanceHistoryViewAllLink')}
                        onClick={this.onViewAllTransactionsClick.bind(this)} />
                </div>
            </div>
        )
    }

    renderPurchaseHistory({ sumOfChargesThisYear, numberOfChargesThisYear }) {
        return (
            <div className={cn('-purchaseHistory')}>
                <Msg tagName="h3" id={msgId('purchaseHistory.title')} />

                <div className={cn('-purchaseHistoryInner')}>
                    <div className={cn('-purchaseHistoryCostThisYear')}>
                        <Msg id={msgId('purchaseHistory.costThisYear')}
                            values={{ cost: oreToKrona(sumOfChargesThisYear) }} />
                    </div>
                    <div className={cn('-purchaseHistoryCountThisYear')}>
                        <Msg id={msgId('purchaseHistory.countThisYear')}
                            values={{ count: numberOfChargesThisYear }} />
                    </div>
                    <Link msgId={msgId('purchaseHistory.viewAllLink')}
                        className={cn('-purchaseHistoryViewAllLink')}
                        onClick={this.onViewAllPurchasesClick.bind(this)} />
                </div>
            </div>
        )
    }

    onPurchaseCreditsClick() {
        this.openPane('purchasesmsdistributioncredits');
    }

    onViewAllPurchasesClick() {
        this.openPane('smsdistributioncreditpurchases');
    }

    onViewAllTransactionsClick() {
        this.openPane('smsdistributioncredittransactions');
    }
}
