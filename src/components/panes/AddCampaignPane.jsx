import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';
import Button from '../misc/Button';
import { createCampaign } from '../../actions/campaign';

const mapStateToProps = (state) => ({
    // This component doesn't use values from state, but still uses dispatch
});

@connect(mapStateToProps)
@injectIntl
export default class AddCampaignPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.addCampaign.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <CampaignForm ref="form" campaign={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddCampaignPane-saveButton"
                labelMsg="panes.editCampaign.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();

        this.props.dispatch(createCampaign(values));
        this.closePane();
    }
}
