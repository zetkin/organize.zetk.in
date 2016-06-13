import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CampaignForm from '../forms/CampaignForm';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import { retrieveCampaign, updateCampaign, deleteCampaign }
    from '../../actions/campaign';


@connect(state => state)
export default class EditCampaignPane extends PaneBase {
    componentDidMount() {
        let campaignId = this.props.params[0];
        let campaignItem = getListItemById(
            this.props.campaigns.campaignList, campaignId);

        if (!campaignItem) {
            this.props.dispatch(retrieveCampaign(campaignId));
        }
    }

    getRenderData() {
        let campaignList = this.props.campaigns.campaignList;
        var campaignId = this.props.params[0];

        return {
            campaignItem: getListItemById(campaignList, campaignId),
        }
    }

    getPaneTitle(data) {
        return 'Edit campaign';
    }

    renderPaneContent(data) {
        if (data.campaignItem) {
            return [
                <CampaignForm key="form" ref="form"
                    campaign={ data.campaignItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <Button label="Delete Campaign"
                    onClick={ this.onDeleteClick.bind(this) }
                    className="EditCampaignPane-deleteButton"/>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditCampaignPane-saveButton"
                label="Save Changes"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const campaignId = this.props.params[0];

        this.props.dispatch(updateCampaign(campaignId, values));
    }

    onDeleteClick(ev) {
        const campaignId = this.props.params[0];

        this.props.dispatch(deleteCampaign(campaignId));
        this.closePane();
    }
}
