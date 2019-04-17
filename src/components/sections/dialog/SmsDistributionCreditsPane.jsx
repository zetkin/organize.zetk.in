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
            stats: {
                sum_charges_this_year: sumOfChargesThisYear,
                num_charges_this_year: numberOfChargesThisYear,
            },
        } = creditsData;

        return {
            formatMessage,

            isLoaded,

            availableCredits,
            sumOfChargesThisYear,
            numberOfChargesThisYear,
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
}
