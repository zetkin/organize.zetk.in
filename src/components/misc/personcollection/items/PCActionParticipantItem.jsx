import React from 'react';


export default class PCActionParticipantItem extends React.Component {
    render() {
        let item = this.props.item;
        let name = item.first_name + ' ' + item.last_name;
        let reminderSent = item.reminder_sent;

        return (
            <div className="PCActionParticipantItem">
                <span className="PCActionParticipantItem-name">
                    { name }</span>
                <span className="PCActionParticipantItem-reminder">
                    { reminderSent }</span>
            </div>
        );
    }
}
