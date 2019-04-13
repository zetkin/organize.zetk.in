import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';

import { getListItemById } from '../../utils/store';

const mapStateToProps = (state, props) => {
    let distributionId = props.paneData.params[0];

    return {
        distributionItem: getListItemById(
            state.smsDistributions.distributionList,
            distributionId,
        ),
    };
};

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionPane extends PaneBase {
    getRenderData() {
        const {
            distributionItem,
        } = this.props;

        const isLoaded = distributionItem && !distributionItem.isPending && distributionItem.data;

        const data = distributionItem && distributionItem.data;

        const state = data && data.state;

        const title = data && data.title;
        const sender = data && data.sender;
        const message = data && data.message;

        return {
            isLoaded,

            state,

            title,
            sender,
            message,
        };
    }

    getPaneTitle(data) {
        const { distributionItem } = this.props;

        if (!distributionItem || !distributionItem.data || distributionItem.isPending) {
            return null;
        }

        return this.props.distributionItem.data.title;
    }

    renderPaneContent({ isLoaded, title, sender, message }) {
        if (!isLoaded) {
            return <LoadingIndicator />;
        }

        return (
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
        );
    }
}
