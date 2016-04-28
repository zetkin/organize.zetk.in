import React from 'react';


export default class Action extends React.Component {
    render() {
        const action = this.props.action;
        const startDate = Date.utc.create(action.start_time);
        const endDate = Date.utc.create(action.end_time);
        const timeLabel = startDate.setUTC(true)
            .format('{yyyy}-{MM}-{dd}, {HH}:{mm}')
            .concat('-' + endDate.setUTC(true).format('{HH}:{mm}'));

        return (
            <span className="Action">
                <span className="Action-activity">{ action.activity.title }</span>
                <span className="Action-location">{ action.location.title }</span>
                <span className="Action-date">{ timeLabel }</span>
            </span>
        );
    }
}

Action.propTypes = {
    action: React.PropTypes.object.isRequired
};
