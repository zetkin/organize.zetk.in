import cx from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';

const cn = (suffix = '') => `SmsDistributionCreditTransactionListItem${suffix}`;
const msgId = suffix => `lists.smsDistributionCreditTransactionList.item.${suffix}`;

@injectIntl
export default class SmsDistributionCreditTransactionListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
        showBalance: React.PropTypes.bool,
    };

    render() {
        const {
            data: {
                created,
                amount,
                balance,
            },
            showBalance,
            intl: {
                formatMessage,
            },
        } = this.props;

        return (
            <div
                className={cx([
                    cn(),
                    { [cn('-showBalance')]: showBalance },
                ])}
                onClick={this.props.onItemClick}
            >
                <div className={cn('-createdIcon')} />
                <div className={cn('-created')}>
                    {Date
                        .create(created, { fromUTC: true })
                        .format('{yyyy}-{MM}-{dd}')
                    }
                </div>

                <div className={cx([
                    cn('-amountIcon'),
                    { [cn('-amountIcon-negative')]: amount < 0 },
                ])} />
                <div className={cn('-amount')}>
                    {formatMessage(
                        { id: msgId('amount') },
                        { amount: Math.abs(amount) },
                    )}
                </div>

                {showBalance && (
                    <div key="icon" className={cn('-balanceIcon')} />
                )}
                {showBalance && (
                    <div key="value" className={cn('-balance')}>
                        {formatMessage(
                            { id: msgId('balance') },
                            { balance },
                        )}
                    </div>
                )}
            </div>
        );
    }
}
