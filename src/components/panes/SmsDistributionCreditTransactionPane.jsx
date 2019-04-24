import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';

import {
    retrieveSmsDistributionCreditTransaction,
} from '../../actions/smsDistribution';
import { replacePane } from '../../actions/view';
import { getListItemById } from '../../utils/store';

const oreToKrona = (ore = 0) => (ore / 100).toFixed(2);

const cn = (suffix = '') => `SmsDistributionCreditTransactionPane${suffix}`;
const msgId = suffix => `panes.smsDistributionCreditTransaction.${suffix}`;

const mapStateToProps = (state, { paneData: { params: [transactionId] } }) => ({
    transactionItem: getListItemById(
        state.smsDistributions.transactionList,
        transactionId,
    ),
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionCreditTransactionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const transactionId = this.getParam(0);

        this.props.dispatch(retrieveSmsDistributionCreditTransaction(transactionId));
    }

    componentDidUpdate() {
        const {
            type,
            distributionId,
        } = this.getRenderData();

        if (type === 'distribution') {
            this.props.onReplace('smsdistribution', [distributionId]);
        }
    }

    getRenderData() {
        const {
            intl: {
                formatMessage,
            },
            transactionItem,
        } = this.props;

        const isLoaded = !!(transactionItem && !transactionItem.isPending && transactionItem.data);

        if (!isLoaded) {
            return {
                formatMessage,

                isLoaded,
            };
        }

        const {
            id,
            type,
            created,
            amount,

            distribution_id: distributionId,

            description,

            charge: {
                amount: chargeAmount,
                last4
            } = {},

        } = transactionItem.data;

        const receiptUrl = 'http://example.com#not-implemented';

        return {
            formatMessage,

            isLoaded,

            id,
            type,
            created,
            amount,

            distributionId,

            description,

            chargeAmount,
            last4,
            receiptUrl,
        };
    }

    getPaneTitle({ formatMessage, isLoaded, type }) {
        if (!isLoaded) {
            return null;
        }

        return formatMessage({ id: msgId(`title.${type}`) });
    }

    renderPaneContent(data) {
        const {
            isLoaded,

            type,
        } = data;

        if (!isLoaded) {
            return <LoadingIndicator />;
        }

        if (type === 'distribution') {
            return null;
        } else if (type === 'manual') {
            return this.renderManualPaneContent(data);
        } else if (type === 'purchase') {
            return this.renderPurchasePaneContent(data);
        } else {
            return 'Invalid Type';
        }
    }

    renderManualPaneContent({ created, amount, description }) {
        return (
            <div className={cn()}>
                <InfoList data={[{
                    name: 'created',
                    value: Date.create(created, { fromUTC: true }).format(),
                }, {
                    name: 'amount',
                    msgId: msgId('amount'),
                    msgValues: { amount },
                }, {
                    name: 'description',
                    value: description,
                }]} />
            </div>
        );
    }

    renderPurchasePaneContent({ created, amount, chargeAmount, last4, receiptUrl }) {
        return (
            <div className={cn()}>
                <InfoList data={[{
                    name: 'created',
                    value: Date.create(created, { fromUTC: true }).format(),
                }, {
                    name: 'amount',
                    msgId: msgId('amount'),
                    msgValues: { amount },
                }, {
                    name: 'chargeAmount',
                    msgId: msgId('purchase.chargeAmount'),
                    msgValues: { chargeAmount: oreToKrona(chargeAmount) },
                }, {
                    name: 'last4',
                    value: last4,
                }, {
                    name: 'receipt',
                    msgId: msgId('purchase.receipt'),
                    href: receiptUrl,
                    target: '_blank',
                }]} />
            </div>
        );
    }
}
