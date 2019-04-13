import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import SmsDistributionForm from '../forms/SmsDistributionForm';
import Button from '../misc/Button';

import { createSmsDistribution } from '../../actions/smsDistribution';

const mapStateToProps = (state, props) => ({
});

@connect(mapStateToProps)
@injectIntl
export default class AddSmsDistributionPane extends PaneBase {
    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addSmsDistribution.title' });
    }

    renderPaneContent(data) {
        return (
            <SmsDistributionForm key="form" ref="form"
                onSubmit={this.onSubmit.bind(this)} />
        );
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddSmsDistributionPane-saveButton"
                labelMsg="panes.addSmsDistribution.saveButton"
                onClick={this.onSubmit.bind(this)} />
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const paneId = this.props.paneData.id;
        const values = this.refs.form.getValues();
        const data = {
            ...values,
            target_filters: [],
        };

        this.props.dispatch(createSmsDistribution(data, paneId));
    }
}
