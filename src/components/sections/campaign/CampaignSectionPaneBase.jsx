import moment from 'moment';
import React from 'react';

import PaneBase from '../../panes/PaneBase';


export default class CampaignSectionPaneBase extends PaneBase {
    onCalendarAddAction(date) {
        const selectedId = this.props.campaigns.selectedId;
        const campParam = selectedId || 0;
        const dateParam = moment(date).format('YYYY-MM-DD');

        this.openPane('addaction', campParam, dateParam);
    }

    onCalendarCopyAction(action, date) {
        const oldStartTime = new Date(action.start_time);
        const oldEndTime = new Date(action.end_time);

        const startTime = new Date(date);
        startTime.setHours(oldStartTime.getHours());
        startTime.setMinutes(oldStartTime.getMinutes());
        startTime.setSeconds(oldStartTime.getSeconds());

        const endTime = new Date(date);
        endTime.setHours(oldEndTime.getHours());
        endTime.setMinutes(oldEndTime.getMinutes());
        endTime.setSeconds(oldEndTime.getSeconds());

        const newAction = {
            activity_id: action.activity.id,
            location_id: action.location.id,
            info_text: action.info_text,
            num_participants_required: action.num_participants_required,

            // Use new start and end times
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        };

        this.getActions('action').createAction(action.campaign.id, newAction);
    }

    onCalendarMoveAction(action, date) {
        const oldStartTime = new Date(action.start_time);
        const oldEndTime = new Date(action.end_time);

        const startTime = new Date(date);
        startTime.setHours(oldStartTime.getHours());
        startTime.setMinutes(oldStartTime.getMinutes());
        startTime.setSeconds(oldStartTime.getSeconds());

        const endTime = new Date(date);
        endTime.setHours(oldEndTime.getHours());
        endTime.setMinutes(oldEndTime.getMinutes());
        endTime.setSeconds(oldEndTime.getSeconds());

        const values = {
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        };

        this.getActions('action').updateAction(action.id, values);
    }

    onSelectDay(date) {
        const dateStr = moment(date).format('YYYY-MM-DD');
        this.openPane('actionday', dateStr);
    }

    onSelectAction(action) {
        this.openPane('editaction', action.id);
    }

    onEditCampaign(campaign) {
        this.openPane('editcampaign', campaign.id);
    }

    onCreateCampaign(title) {
        this.openPane('addcampaign', title);
    }
}
