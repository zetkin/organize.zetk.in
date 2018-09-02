import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import TimelineEvent from './TimelineEvent';


export default class ActionTimelineEvent extends React.Component {
    render() {
        const action = this.props.eventData.data.action;
        const startTime = new Date(action.start_time);
        const endTime = new Date(action.end_time);

        return (
            <TimelineEvent className="ActionTimelineEvent"
                title={ action.activity.title }
                onSelect={ this.onSelect.bind(this) }
                >
                <div className="ActionTimelineEvent-time">
                    <FormattedDate value={ startTime }
                        day="numeric" month="short" year="numeric"/>
                    <span>, </span>
                    <FormattedTime value={ startTime } timeZone="UTC"/>
                    -
                    <FormattedTime value={ endTime } timeZone="UTC"/>
                </div>
                <div className="ActionTimelineEvent-location">
                    { action.location.title }
                </div>
            </TimelineEvent>
        );
    }

    onSelect() {
        const action = this.props.eventData.data.action;
        this.props.onSelect(action);
    }
}
