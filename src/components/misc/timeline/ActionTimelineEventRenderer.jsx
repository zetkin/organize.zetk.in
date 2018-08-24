import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class ActionTimelineEventRenderer extends React.Component {
    render() {
        const action = this.props.data.action;
        const now = new Date();
        const ts = new Date(this.props.timestamp);

        const msgId = (ts > now)?
            'timeline.events.action.futureLabel' :
            'timeline.events.action.pastLabel';

        return (
            <Msg id={ msgId }
                values={{
                    person: this.props.person.first_name,
                    activity: action.activity.title,
                    location: action.location.title,
                }}
                />
        );
    }
}
