import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';

import LoadingIndicator from '../../misc/LoadingIndicator';

import {
    retrieveSmsDistributionCredits,
} from '../../../actions/smsDistribution';
import Button from '../../misc/Button';

const cn = (suffix = '') => `SmsDistributionCreditsPane${suffix}`;
const msgId = suffix => `panes.smsDistributionCredits.${suffix}`;

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

        const isLoaded = !!(creditsItem && !creditsItem.isPending && creditsItem.data);

        if (!isLoaded) {
            return {
                isLoaded,
            };
        }

        const creditsData = creditsItem.data;

        const availableCredits = creditsData.available;

        return {
            isLoaded,

            availableCredits,
        };
    }

    renderPaneContent(data) {
        const { isLoaded } = data;

        if (!isLoaded) {
            return <LoadingIndicator />
        }

        return (
            <div className={cn()}>
                <div className={cn('-row')}>
                    <div className={cn('-col')}>
                        {this.renderAvailableCredits(data)}
                    </div>
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
