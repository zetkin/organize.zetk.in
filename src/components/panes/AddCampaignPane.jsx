import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';
import { createCampaign } from '../../actions/campaign';


@connect(state => state)
export default class AddCampaignPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add campagin';
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

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();

        this.props.dispatch(createCampaign(values));
    }
}
