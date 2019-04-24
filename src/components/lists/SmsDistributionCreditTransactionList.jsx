import cx from 'classnames';
import React, { PropTypes } from 'react';

import List from './List';
import SmsDistributionCreditTransactionListItem from './items/SmsDistributionCreditTransactionListItem';

const msgId = suffix => `lists.smsDistributionCreditTransactionList.${suffix}`;
const cn = (suffix = '') => `SmsDistributionCreditTransactionList${suffix}`;

export default class SmsDistributionCreditTransactionList extends React.Component {
    static propTypes = {
        onItemClick: PropTypes.func,
        showBalance: PropTypes.bool,
        transactionList: PropTypes.shape({
            error: PropTypes.object,
            isPending: PropTypes.bool,
            items: PropTypes.array,
        }).isRequired,
    }

    render() {
        const {
            onItemClick,
            showBalance = true,
            transactionList,
        } = this.props;

        let columns;
        if (showBalance) {
            columns = [
                { 'created': msgId('header.created') },
                { 'amount': msgId('header.amount') },
                { 'balance': msgId('header.balance') },
            ];
        } else {
            columns = [
                { 'created': msgId('header.created') },
                { 'amount': msgId('header.amount') },
            ];
        }

        return (
            <List
                className={cx([
                    cn(),
                    { [cn('-showBalance')]: showBalance }
                ])}
                headerColumns={columns}
                itemComponent={SmsDistributionCreditTransactionListItem}
                itemProps={{ showBalance }}
                list={transactionList}
                onItemClick={onItemClick} />
        );
    }
}
