import React from 'react';

import ActionTimelineEventRenderer from './ActionTimelineEventRenderer';
import TimelineEvent from './TimelineEvent';


export default class PersonTimeline extends React.Component {
    static propTypes = {
        person: React.PropTypes.object,
        timeline: React.PropTypes.shape({
            items: React.PropTypes.array,
        }),
    };

    render() {
        const eventItems = this.props.timeline.items.map(item => {
            const eventObj = item.data;

            return (
                <TimelineEvent key={ eventObj.timestamp }
                    renderer={ ActionTimelineEventRenderer }
                    timestamp={ eventObj.timestamp }
                    person={ this.props.person }
                    data={ eventObj.data }
                    />
            );
        });

        return (
            <div className="PersonTimeline">
                { eventItems }
            </div>
        );
    }
}
