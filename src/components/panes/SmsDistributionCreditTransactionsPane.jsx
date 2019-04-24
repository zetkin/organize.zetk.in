import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import SmsDistributionCreditTransactionList from '../lists/SmsDistributionCreditTransactionList';
import PaneBase from './PaneBase';
import {
    retrieveSmsDistributionCreditTransactions,
} from '../../actions/smsDistribution';
import { createList } from '../../utils/store';

const msgId = suffix => `panes.smsDistributionCreditTransactions.${suffix}`;

const mapStateToProps = (state, props) => ({
    transactionList: state.smsDistributions.transactionList,
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionCreditTransactionsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSmsDistributionCreditTransactions());
    }

    getRenderData() {
        let {
            paneData: {
                params: [type],
            },
            transactionList,
        } = this.props;

        const showBalance = !type;

        if (type) {
            transactionList = createList(transactionList.items
                .map(i => i.data)
                .filter(d => d.type === type)
            );
        }

        return {
            type,
            showBalance,
            transactionList,
        }
    }

    getPaneTitle({ type }) {
        const formatMessage = this.props.intl.formatMessage;

        return formatMessage({ id: msgId(`title.${type || 'all'}`) });
    }

    renderPaneContent({ showBalance, transactionList }) {
        return (
            <SmsDistributionCreditTransactionList
                showBalance={showBalance}
                transactionList={transactionList}
                onItemClick={this.onItemClick.bind(this)} />
        )
    }

    onItemClick(item) {
        this.openPane('smsdistributioncredittransaction', item.data.id);
    }
}
