import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import PersonList from '../lists/PersonList';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import {
    retrieveSmsDistributionTargets,
} from '../../actions/smsDistribution';

const mapStateToProps = (state, { paneData: { params: [id] } }) => ({
    distribution: getListItemById(state.smsDistributions.distributionList, id),
    targets: state.smsDistributions.targetsByDistribution[id],
});

@connect(mapStateToProps)
@injectIntl
export default class SmsDistributionTargetsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const {
            paneData: {
                params: [distributionId],
            },
            targets,
        } = this.props;

        if (!targets) {
            this.props.dispatch(retrieveSmsDistributionTargets(distributionId));
        }
    }

    getRenderData() {
        return {
            distribution: this.props.distribution,
            targets: this.props.targets,
        }
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        return formatMessage({ id: 'panes.smsDistributionTargets.title' });
    }

    getPaneSubTitle({ distribution }) {
        return distribution && distribution.data && distribution.data.title;
    }

    renderPaneContent({ targets }) {
        if (!targets || targets.isPending) {
            return <LoadingIndicator />;
        }

        return (
            <PersonList personList={targets} sortByDefault={true}
                onItemClick={this.onItemClick.bind(this)} />
        );
    }

    onItemClick(item, event) {
        if (event && event.altKey) {
            this.openPane('editperson', item.data.id);
        } else {
            this.openPane('person', item.data.id);
        }
    }
}
