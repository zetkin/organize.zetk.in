import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';

import Button from '../misc/Button';

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
            <h1>Placeholder</h1>
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
        alert('Not implemented.');
    }
}
