import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveCampaign, updateCampaign, deleteCampaign }
    from '../../actions/campaign';


@connect(state => state)
@injectIntl
export default class EditCampaignPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let campaignId = this.getParam(0);
        let campaignItem = getListItemById(
            this.props.campaigns.campaignList, campaignId);

        if (!campaignItem) {
            this.props.dispatch(retrieveCampaign(campaignId));
        }
    }

    getRenderData() {
        let campaignList = this.props.campaigns.campaignList;
        var campaignId = this.getParam(0);

        return {
            campaignItem: getListItemById(campaignList, campaignId),
        }
    }

    getPaneTitle(data) {
        if (data.campaignItem && !data.campaignItem.isPending) {
            return this.props.intl.formatMessage(
                { id: 'panes.editCampaign.title' },
                { campaign: data.campaignItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.campaignItem) {
            return [
                <CampaignForm key="form" ref="form"
                    campaign={ data.campaignItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <Button key="deleteButton"
                    labelMsg="panes.editCampaign.deleteButton"
                    onClick={ this.onDeleteClick.bind(this) }
                    className="EditCampaignPane-deleteButton"/>
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditCampaignPane-saveButton"
                labelMsg="panes.editCampaign.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const campaignId = this.getParam(0);

        this.props.dispatch(updateCampaign(campaignId, values));
        this.closePane();
    }

    onDeleteClick(ev) {
        const campaignId = this.getParam(0);

        this.props.dispatch(deleteCampaign(campaignId));
        this.closePane();
    }
}
