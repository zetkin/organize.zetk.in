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

const cn = (suffix = '') => `SmsDistributionCreditsPane${suffix}`;
const msgId = suffix => `panes.smsDistributionCredits.${suffix}`;

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

        const availableCredits = creditsData.available;

        return {
            formatMessage,

            isLoaded,

            availableCredits,
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

    onPurchaseCreditsClick() {
        this.openPane('purchasesmsdistributioncredits');
    }
}
