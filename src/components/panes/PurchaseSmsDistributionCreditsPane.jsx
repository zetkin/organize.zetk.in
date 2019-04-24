import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import {
    CardCVCElement,
    CardExpiryElement,
    CardNumberElement,
    Elements,
    injectStripe,
    StripeProvider,
} from 'react-stripe-elements';

import PaneBase from './PaneBase';

import Button from '../misc/Button';

import {
    initPayments,
} from '../../actions/payments';
import {
    retrieveSmsDistributionCredits,
    beginSmsDistributionCreditPurchase,
    completeSmsDistributionCreditPurchase,
    endSmsDistributionCreditPurchase,
} from '../../actions/smsDistribution';

import LoadingIndicator from '../../common/misc/LoadingIndicator';

import makeRandomString from '../../utils/makeRandomString';

const cn = (suffix = '') => 'PurchaseSmsDistributionCreditsPane' + suffix;
const msgId = suffix => 'panes.purchaseSmsDistributionCredits.' + suffix;

const costForCredits = (credits, tiers) => {
    let unchargedCredits = credits;

    let cost = 0

    for (let i = tiers.length - 1; i >= 0; i--) {
        const {
            minQuantity: tierMinQuantity,
            unitPrice: tierUnitPrice,
        } = tiers[i];

        const tierCredits = unchargedCredits - tierMinQuantity + 1;

        if (tierCredits <= 0) continue

        const tierCost = tierCredits * tierUnitPrice

        cost += tierCost
        unchargedCredits -= tierCredits
    }

    return cost;
}

const oreToKrona = (ore = 0) => (ore / 100).toFixed(2);

const mapStateToProps = (state, props) => ({
    creditsItem: state.smsDistributions.creditsItem,
    payments: state.payments,
    purchases: state.smsDistributions.purchases,
    userName: `${state.user.user.first_name} ${state.user.user.last_name}`,
});

@connect(mapStateToProps)
@injectIntl
// HOC version of https://github.com/stripe/react-stripe-elements#getting-started.
@(WrappedComponent => props => (
    <StripeProvider stripe={props.payments.stripe}>
        <Elements>
            <WrappedComponent {...props} />
        </Elements>
    </StripeProvider>
))
@injectStripe
export default class PurchaseSmsDistributionCreditsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            state: 'cart',
            rawCredits: 100,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(initPayments());
        this.props.dispatch(retrieveSmsDistributionCredits());

        const purchaseId = makeRandomString();

        this.setState({
            purchaseId,
        });

        this.props.dispatch(beginSmsDistributionCreditPurchase(purchaseId));
    }

    componentWillUnmount() {
        const {
            purchaseId,
        } = this.state;

        this.props.dispatch(endSmsDistributionCreditPurchase(purchaseId));
    }

    componentWillReceiveProps(nextProps) {
        const {
            purchases,
        } = nextProps;
        const {
            purchaseId,
            state,
        } = this.state;

        if (!purchaseId) {
            return;
        }

        const purchase = purchases[purchaseId];

        if (!purchase || !purchase.data) {
            return;
        }

        const {
            id: transactionId,
        } = purchase.data;

        if (state !== 'done') {
            this.setState({
                state: 'done',
            });

            this.props.dispatch(retrieveSmsDistributionCredits());

            this.props.onReplace('smsdistributioncredittransaction',
                [transactionId]);
        }
    }

    getRenderData() {
        const {
            intl: {
                formatMessage,
            },
            creditsItem,
            payments,
            purchases,
            stripe,
            userName,
        } = this.props;

        const {
            purchaseId,
            state,
            rawCredits,
        } = this.state;

        const creditsIsLoaded = !!(creditsItem && !creditsItem.isPending && creditsItem.data);
        const isLoaded = creditsIsLoaded && payments.isLoaded;

        if (!isLoaded) {
            return { formatMessage, isLoaded }
        }

        const purchase = purchases[purchaseId];

        const isPending = !!(purchase && purchase.isPending);

        const error = purchase && purchase.error && purchase.error.message;

        const {
            config: {
                min_charge_amount: minChargeAmount,
            },
        } = payments;

        const {
            price_tiers,
        } = creditsItem.data;

        const tiers = [{
            minQuantity: 1,
            maxQuantity: price_tiers[1].quantity - 1,
            unitPrice: price_tiers[0].unit_price,
        }];
        for (let i = 1; i < price_tiers.length; i++) {
            tiers.push({
                minQuantity: price_tiers[i].quantity,
                maxQuantity: price_tiers[i + 1] && price_tiers[i + 1].quantity - 1,
                unitPrice: price_tiers[i].unit_price,
            });
        }
        const credits = parseInt(rawCredits, 10) || 0;
        const cost = isLoaded && costForCredits(credits, tiers);

        const minCredits = Math.ceil(minChargeAmount / price_tiers[0].unit_price);
        const toFewCredits = credits < minCredits;

        return {
            formatMessage,

            isLoaded,
            isPending,

            userName,

            state,

            tiers,

            rawCredits,
            credits,
            cost,

            minCredits,
            toFewCredits,

            error,

            stripe,
        };
    }

    getPaneTitle({ formatMessage, state = 'cart' }) {
        return formatMessage({ id: msgId(`title.${state}`) });
    }

    renderPaneContent(data) {
        const { isLoaded, state } = data;

        if (!isLoaded) {
            return <LoadingIndicator />
        }

        if (state === 'cart') {
            return this.renderCartPaneContent(data);
        } else if (state === 'checkout') {
            return this.renderCheckoutPaneContent(data);
        }
    }

    renderPaneFooter(data) {
        const { isLoaded, state } = data;

        if (!isLoaded) {
            return null;
        }

        if (state == 'cart') {
            return this.renderCartPaneFooter(data);
        } else if (state === 'checkout') {
            return this.renderCheckoutPaneFooter(data);
        }
    }

    // Cart

    renderCartPaneContent({ rawCredits, cost, tiers, minCredits, toFewCredits }) {
        return (
            <div className={cn()}>
                <form onSubmit={this.onCartSubmit.bind(this)}>
                    <div className={cn('-amountContainer')}>
                        <Msg tagName="label" id={msgId('amountLabel')} />
                        <input name="amount" type="number" value={rawCredits}
                            onChange={this.onCreditsChange.bind(this)} />
                    </div>

                    <div className={cn('-costContainer')}>
                        <Msg tagName="label" id={msgId('costLabel')} />
                        <div className={cn('-cost')}>
                            <Msg id={msgId('cost')}
                                values={{ amount: oreToKrona(cost) }} />
                        </div>
                    </div>

                    {toFewCredits && (
                        <div className={cn('-toFewCredits')}>
                            <Msg id={msgId('toFewCredits')}
                                values={{ minCredits }} />
                        </div>
                    )}
                </form>

                <div className={cn('-tiers')}>
                    <Msg tagName="h3"
                        id={msgId('tiersTitle')} />
                    <table>
                        <tbody>
                            {tiers.map(({ minQuantity, maxQuantity, unitPrice }) => (
                                <tr key={minQuantity}>
                                    <td className={cn('-tierMinQuantity')}>
                                        {minQuantity}
                                    </td>
                                    <td>–</td>
                                    <td className={cn('-tierMaxQuantity')}>
                                        {maxQuantity}
                                    </td>
                                    <td>:</td>
                                    <td className={cn('-tierUnitPrice')}>
                                        <Msg id={msgId('tierUnitPrice')}
                                            values={{
                                                unitPrice: oreToKrona(unitPrice),
                                            }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderCartPaneFooter({ toFewCredits }) {
        return (
            <Button
                labelMsg={msgId('checkoutButton')}

                isDisabled={toFewCredits}
                onClick={this.onCheckoutClick.bind(this)}
            />
        );

    }

    onCreditsChange(ev) {
        const rawCredits = ev.target.value;

        this.setState({
            rawCredits,
        });
    }

    onCartSubmit(ev) {
        ev.preventDefault();
    }

    onCheckoutClick(ev) {
        const {
            toFewCredits,
        } = this.getRenderData();

        if (toFewCredits) {
            return;
        }

        this.setState({
            state: 'checkout',
        });
    }

    // Checkout

    renderCheckoutPaneContent({ userName, cost, error }) {
        return (
            <div className={cn()}>
                <form onSubmit={this.onCheckoutSubmit.bind(this)}>
                    <div className={cn('-nameContainer')}>
                        <Msg tagName="label" id={msgId('nameLabel')} />
                        <input key="name" ref="name" name="name" defaultValue={userName} />
                    </div>

                    <div className={cn('-cardNumberContainer')}>
                        <Msg tagName="label" id={msgId('cardNumberLabel')} />
                        <CardNumberElement onReady={this.onCardElementReady} />
                    </div>

                    <div className={cn('-expiryContainer')}>
                        <Msg tagName="label" id={msgId('expiryLabel')} />
                        <CardExpiryElement />
                    </div>

                    <div className={cn('-cvcContainer')}>
                        <Msg tagName="label" id={msgId('cvcLabel')} />
                        <CardCVCElement />
                    </div>

                    <div className={cn('-error')}>
                        {error}
                    </div>

                    <div className={cn('-checkoutCost')}>
                        <Msg id={msgId('checkoutCost')} values={{
                            cost: oreToKrona(cost),
                        }} />
                    </div>
                </form>
            </div>
        );
    }

    renderCheckoutPaneFooter({ isPending }) {
        return (
            <Button
                labelMsg={msgId('payButton')}
                isDisabled={isPending}
                onClick={this.onPayClick.bind(this)}
            />
        )
    }

    onCardElementReady(el) {
        el.focus();
    }

    onCheckoutSubmit(ev) {
        ev.preventDefault();
    }

    onPayClick(ev) {
        const {
            credits,
            cost,
            stripe,
        } = this.getRenderData();
        const {
            purchaseId,
        } = this.state;

        const name = this.refs.name.value;

        this.props.dispatch(completeSmsDistributionCreditPurchase(
            purchaseId,
            stripe,
            name,
            credits,
            cost,
        ));
    }
}
