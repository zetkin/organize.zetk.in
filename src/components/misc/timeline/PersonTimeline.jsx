import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import ActionTimelineEvent from './renderers/ActionTimelineEvent';
import MultiActionTimelineEvent from './renderers/MultiActionTimelineEvent';



export default class PersonTimeline extends React.Component {
    static propTypes = {
        person: React.PropTypes.object,
        timeline: React.PropTypes.shape({
            items: React.PropTypes.array,
        }),
    };

    render() {
        const now = new Date();

        const eventItems = this.props.timeline.items
            .filter(item => now > new Date(item.data.timestamp))
            .map((item, idx) => {
                const eventData = item.data;

                return (
                    <ActionTimelineEvent key={ idx }
                        onSelect={ this.onSelect.bind(this, eventData.event) }
                        eventData={ eventData }
                        />
                );
            });

        // TODO: General-purpose (or back-end) solution for this
        const futureEvents = this.props.timeline.items
            .filter(item => now < new Date(item.data.timestamp));

        if (futureEvents.length) {
            const futureActions = futureEvents.map(item => item.data.data.action);
            const eventData = {
                event: 'action',
                timestamp: futureEvents[0].data.timestamp,
                data: {
                    actions: futureActions,
                }
            };
            const futureActionItem = (
                <MultiActionTimelineEvent key={ eventData.timestamp }
                    onSelect={ this.onSelect.bind(this, eventData.event) }
                    eventData={ eventData }
                    />
            );

            eventItems.unshift(
                <div key="now" className="PersonTimeline-now">
                    <Msg id="timeline.nowDelimiter"/>
                </div>
            );
            eventItems.unshift(futureActionItem);
        }

        return (
            <div className="PersonTimeline">
                { eventItems }
            </div>
        );
    }

    onSelect(eventType, data) {
        if (this.props.onSelect) {
            this.props.onSelect(eventType, data);
        }
    }
}
