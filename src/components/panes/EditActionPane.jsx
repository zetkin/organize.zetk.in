import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import ActionForm from '../forms/ActionForm';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import { retrieveAction, updateAction } from '../../actions/action';


@connect(state => state)
@injectIntl
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
        return this.props.intl.formatMessage({ id: 'panes.editAction.title' });
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
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditActionPane-saveButton"
                labelMsg="panes.editAction.saveButton"
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
        this.openPane('editlocation', loc.id);
    }

    onEditActivity(activity) {
        this.openPane('editactivity', activity.id);
    }

    onCreateCampaign(title) {
        this.openPane('addcampaign', title);
    }

    onCreateLocation(title) {
        this.openPane('addlocation', title);
    }

    onCreateActivity(title) {
        this.openPane('addactivity', title);
    }
}
