import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ActionForm from '../forms/ActionForm';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import { retrieveAction, updateAction } from '../../actions/action';


@connect(state => state)
export default class EditActionPane extends PaneBase {
    getRenderData() {
        let actionId = this.getParam(0);
        let actionList = this.props.actions.actionList;
        let actionItem = getListItemById(actionList, actionId);

        if (!actionItem) {
            retrieveAction(actionId);
        }

        return {
            actionItem: actionItem
        }
    }

    getPaneTitle(data) {
        return 'Edit action';
    }

    renderPaneContent(data) {
        if (data.actionItem) {
            return (
                <ActionForm ref="form" action={ data.actionItem.data }
                    activities={ this.props.activities }
                    campaigns={ this.props.campaigns }
                    locations={ this.props.locations }
                    dispatch={ this.props.dispatch }
                    onEditCampaign={ this.onEditCampaign.bind(this) }
                    onEditLocation={ this.onEditLocation.bind(this) }
                    onEditActivity={ this.onEditActivity.bind(this) }
                    onCreateCampaign={ this.onCreateCampaign.bind(this) }
                    onCreateLocation={ this.onCreateLocation.bind(this) }
                    onCreateActivity={ this.onCreateActivity.bind(this) }
                    onSubmit={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditActionPane-saveButton"
                label="Save Changes"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        var values = this.refs.form.getChangedValues();
        var actionId = this.getParam(0);

        this.props.dispatch(updateAction(actionId, values));
    }

    onEditCampaign(campaign) {
        this.openPane('editcampaign', campaign.id);
    }

    onEditLocation(loc) {
        this.openPane('editlocationwithmap', loc.id);
    }

    onEditActivity(activity) {
        this.openPane('editactivity', activity.id);
    }

    onCreateCampaign(title) {
        this.openPane('addcampaign', title);
    }

    onCreateLocation(title) {
        this.openPane('addlocationwithmap', title);
    }

    onCreateActivity(title) {
        this.openPane('addactivity', title);
    }
}
