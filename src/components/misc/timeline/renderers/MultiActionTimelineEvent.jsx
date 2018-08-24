import React from 'react';
import {
    FormattedDate,
    FormattedTime,
    FormattedMessage as Msg,
} from 'react-intl';

import TimelineEvent from './TimelineEvent';


export default class MultiActionTimelineEvent extends React.Component {
    render() {
        const now = new Date();
        const ts = new Date(this.props.eventData.timestamp);
        const actions = this.props.eventData.data.actions;

        const title = (
            <Msg id="timeline.events.multiAction.title"
                values={{ count: actions.length }}
                />
        );

        const subItems = actions.map(action => {
            const startTime = new Date(action.start_time);
            const endTime = new Date(action.end_time);

            return [
                <h4 key="h">{ action.activity.title }</h4>,
                <div key="time" className="MultiActionTimelineEvent-time">
                    <FormattedDate value={ startTime }
                        day="numeric" month="short" year="numeric"/>
                    <span>, </span>
                    <FormattedTime value={ startTime }/>
                    -
                    <FormattedTime value={ endTime }/>
                </div>,
                <div key="location" className="MultiActionTimelineEvent-location">
                    { action.location.title }
                </div>
            ];
        });

        return (
            <TimelineEvent className="MultiActionTimelineEvent"
                title={ title }
                subItems={ subItems }
                >
            </TimelineEvent>
        );
    }
}
