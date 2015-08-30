import React from 'react/addons';
import moment from 'moment';

import PaneBase from '../../panes/PaneBase';


export default class PaneWithCalendar extends PaneBase {
    onCalendarAddAction(date) {
        const campaignStore = this.getStore('campaign');
        const selectedCampaign = campaignStore.getSelectedCampaign();
        const campParam = selectedCampaign? selectedCampaign.id : 0;
        const dateParam = moment(date).format('YYYY-MM-DD');

        this.gotoSubPane('addaction', campParam, dateParam);
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
        this.gotoSubPane('actionday', dateStr);
    }

    onSelectAction(action) {
        this.gotoSubPane('editaction', action.id);
    }
}
