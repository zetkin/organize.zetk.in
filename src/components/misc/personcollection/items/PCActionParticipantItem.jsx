import React from 'react';

import {
    FormattedMessage as Msg,
    FormattedRelative
} from 'react-intl';

export default class PCActionParticipantItem extends React.Component {
    render() {
        let item = this.props.item;
        let name = item.first_name + ' ' + item.last_name;

        let remindedLabel = null;

        if (item.reminder_sent) {
            let date = Date.create(item.reminder_sent);
            let now = new Date();
            if (date > now) {
                date = now;
            }

            let relativeTime = (
                <FormattedRelative value={ date }/>
            );

            remindedLabel = (
                <span className="reminded">
                    <Msg id="panes.action.participants.item.reminded"
                        values={{ relativeTime }}/>
                </span>
            );
        }
        else {
            remindedLabel = (
                <Msg id="panes.action.participants.item.notReminded"/>
            );
        }

        return (
            <div className="PCActionParticipantItem">
                <span className="PCActionParticipantItem-name">
                    { name }</span>
                <span className="PCActionParticipantItem-reminder">
                    { remindedLabel }
                </span>
            </div>
        );
    }
}
