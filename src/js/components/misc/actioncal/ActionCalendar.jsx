import React from 'react/addons';

import ActionWeek from './ActionWeek';
import ActionDay from './ActionDay';


export default class ActionCalendar extends React.Component {
    render() {
        const actions = this.props.actions;

        var startDate = this.props.startDate;
        var endDate = this.props.endDate;

        if (!startDate && actions.length > 0) {
            startDate = new Date(actions[0].start_time);
        }

        if (!endDate && actions.length > 0) {
            endDate = new Date(actions[actions.length-1].end_time);
        }

        // Always start on previous Monday
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

        // Always end on next Sunday
        endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));

        var d = new Date(startDate.toDateString());
        var weeks = [];
        var days = [];
        var idx = 0;

        while (d <= endDate) {
            var dayActions = [];

            while (idx < actions.length) {
                const action = actions[idx];
                const ad = new Date(action.start_time);

                if (d.getYear() == ad.getYear()
                    && d.getMonth() == ad.getMonth()
                    && d.getDate() == ad.getDate()) {

                    dayActions.push(action);

                    idx++;
                }
                else {
                    break;
                }
            }

            days.push(
                <ActionDay date={ new Date(d) } actions={ dayActions }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
            );

            if (d.getDay() == 0) {
                weeks.push(
                    <ActionWeek firstDate={ new Date(d) }>
                        { days }
                    </ActionWeek>
                );

                days = [];
            }

            d.setDate(d.getDate() + 1);
        }

        return (
            <div className="actioncalendar">
                { weeks }
            </div>
        );
    }

    onSelectAction(action) {
        if (this.props.onSelectAction) {
            this.props.onSelectAction(action);
        }
    }
}

ActionCalendar.propTypes = {
    onSelectAction: React.PropTypes.func
};
